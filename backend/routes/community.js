const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Ensure uploads folder exists ──
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ── Multer config ──
const storage = multer.diskStorage({
  destination: function(req, file, cb) { cb(null, uploadDir); },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function(req, file, cb) {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Images only!'));
  }
});

// ── Post Schema ──
let Post;
try {
  Post = mongoose.model('Post');
} catch(e) {
  const postSchema = new mongoose.Schema({
    user:     { type: String, required: true },
    caption:  { type: String, default: '' },
    imgUrl:   { type: String, required: true },
    likes:    { type: Number, default: 0 },
    comments: [{
      user: { type: String, default: 'ANONYMOUS' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }]
  }, { timestamps: true });
  Post = mongoose.model('Post', postSchema);
}

// ── GET all posts ──
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST create post ──
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { user, caption } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    const imgUrl = '/uploads/' + req.file.filename;
    const post = await Post.create({ user: user || 'ANONYMOUS', caption, imgUrl });
    res.status(201).json(post);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST like a post ──
router.post('/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: req.body.action === 'unlike' ? -1 : 1 } },
      { new: true }
    );
    res.json(post);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST add comment ──
router.post('/posts/:id/comment', async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text required' });
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: user || 'ANONYMOUS', text } } },
      { new: true }
    );
    res.json(post);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE post ──
router.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;