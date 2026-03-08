const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ── Import model from separate file ──
// We define the schema here only if it hasn't been registered yet
const mongoose = require('mongoose');

let Caretaker;
try {
  Caretaker = mongoose.model('Caretaker');
} catch (e) {
  const caretakerSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  }, { timestamps: true });
  Caretaker = mongoose.model('Caretaker', caretakerSchema);
}

// ── POST /api/caretaker/save ──
router.post('/save', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    let caretaker = await Caretaker.findOne();
    if (caretaker) {
      caretaker.name  = name;
      caretaker.email = email;
      caretaker.phone = phone;
      await caretaker.save();
    } else {
      caretaker = await Caretaker.create({ name, email, phone });
    }
    res.status(200).json(caretaker);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Failed to save caretaker' });
  }
});

// ── GET /api/caretaker/details ──
router.get('/details', async (req, res) => {
  try {
    const caretaker = await Caretaker.findOne();
    if (!caretaker) return res.status(404).json(null);
    res.status(200).json(caretaker);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch caretaker' });
  }
});

// ── POST /api/caretaker/sos ──
router.post('/sos', async (req, res) => {
  try {
    const { lat, lng, accuracy } = req.body;

    const caretaker = await Caretaker.findOne();
    if (!caretaker) {
      return res.status(404).json({ error: 'No caretaker saved. Please save caretaker details first.' });
    }

    const mapsLink = (lat && lng)
      ? 'https://maps.google.com/?q=' + lat + ',' + lng
      : null;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const locationHtml = mapsLink
      ? '<p><strong>Live Location:</strong><br/><a href="' + mapsLink + '" style="color:#ff4444;">' + mapsLink + '</a></p><p>Coordinates: ' + lat + ', ' + lng + ' (Accuracy: +/-' + Math.round(accuracy || 0) + 'm)</p>'
      : '<p>Location could not be determined.</p>';

    await transporter.sendMail({
      from: '"SPOKIO Emergency" <' + process.env.EMAIL_USER + '>',
      to: caretaker.email,
      subject: 'SOS ALERT — SPOKIO Emergency System',
      html: '<div style="font-family:monospace;background:#0a0000;color:#fff;padding:30px;border:2px solid #ff1e1e;border-radius:10px;"><h1 style="color:#ff1e1e;">EMERGENCY SOS TRIGGERED</h1><hr style="border-color:#ff1e1e"/><p><strong>Time:</strong> ' + timestamp + '</p><p><strong>Caretaker:</strong> ' + caretaker.name + '</p>' + locationHtml + '<hr style="border-color:#ff1e1e"/><p style="color:#ff6060;">This alert was sent automatically by SPOKIO. Please check on the user immediately.</p></div>',
    });

    console.log('SOS email sent to', caretaker.email);
    res.status(200).json({ success: true, sentTo: caretaker.email });

  } catch (err) {
    console.error('SOS route error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;