const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cbA) => {
    if (path.extname(file.originalname).toLowerCase() !== '.ttf') {
      return cb(new Error('Only .ttf files allowed!'));
    }
    cb(null, true);
  }
});

module.exports = (db) => {
  const router = express.Router();

  // Upload font
  router.post('/upload', upload.single('font'), (req, res) => {
    const name = req.file.originalname;
    const filePath = req.file.filename;

    const stmt = db.prepare('INSERT INTO fonts (name, file_path) VALUES (?, ?)');
    stmt.run(name, filePath);

    res.json({ success: true });
  });

  // Get all fonts
  router.get('/', (req, res) => {
    const stmt = db.prepare('SELECT * FROM fonts');
    const fonts = stmt.all();
    res.json(fonts);
  });

  // Delete a font
    router.delete('/:id', (req, res) => {
  const fontId = req.params.id;

  // Check if used in group
  const linked = db.prepare('SELECT COUNT(*) as count FROM font_group_fonts WHERE font_id = ?').get(fontId);
  if (linked.count > 0) {
    return res.status(400).json({ error: 'Font is linked in a group. Remove it from groups first.' });
  }

  const font = db.prepare('SELECT file_path FROM fonts WHERE id = ?').get(fontId);
  if (font) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'uploads', font.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    db.prepare('DELETE FROM fonts WHERE id = ?').run(fontId);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Font not found' });
  }
});


  return router;
};

