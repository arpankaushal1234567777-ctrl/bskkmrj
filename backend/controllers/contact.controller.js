function getContact(_req, res) {
  res.json({
    organization: "भारतीय श्रमिक कामगार कर्मचारी महासंघ राजस्थान",
    phone: "+919451238931",
    footerPhone: "01147095426",
    address:
      "84, North Ave, North Avenue Road Area, Raisina Hills, New Delhi, Delhi 110001",
    mapUrl: "https://maps.app.goo.gl/yRtRmDRg8NuPodGg7",
  });
}

module.exports = { getContact };
