const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// SQLite setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      transaction_id TEXT,
      aadhar_path TEXT,
      photo_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Endpoint to handle "Join Us" form submission
app.post('/api/join', upload.fields([{ name: 'aadharCard', maxCount: 1 }, { name: 'photoUpload', maxCount: 1 }]), (req, res) => {
  const { name, email, phone, transactionId } = req.body;
  const aadharPath = req.files['aadharCard'] ? req.files['aadharCard'][0].filename : '';
  const photoPath = req.files['photoUpload'] ? req.files['photoUpload'][0].filename : '';

  const query = `INSERT INTO messages (name, email, phone, transaction_id, aadhar_path, photo_path) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [name, email, phone, transactionId, aadharPath, photoPath], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ success: true, message: 'Message submitted successfully', id: this.lastID });
  });
});

// Endpoint for Admin Panel to get all messages
app.get('/api/messages', (req, res) => {
  db.all(`SELECT * FROM messages ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(rows);
  });
});

// Serve frontend and admin statically
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));
app.use('/admin-panel', express.static(path.join(__dirname, 'admin-panel')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Redirect root to frontend
app.get('/', (req, res) => {
  res.redirect('/frontend/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
