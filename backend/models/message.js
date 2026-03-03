function Message({ name, email, message }) {
  return { name, email, message, createdAt: new Date().toISOString() };
}

module.exports = { Message };

