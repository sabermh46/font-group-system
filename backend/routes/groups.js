const express = require('express');

module.exports = (db) => {
  const router = express.Router();


  // Create group with title + font names
  router.post('/', (req, res) => {
  const { groupTitle, fonts } = req.body;

  if (!groupTitle || !groupTitle.trim()) {
    return res.status(400).json({ error: 'Group title is required.' });
  }

  const exists = db
    .prepare('SELECT COUNT(*) as count FROM font_groups WHERE LOWER(title) = ?')
    .get(groupTitle.trim().toLowerCase());
  if (exists.count > 0) {
    return res.status(400).json({ error: 'Group title already exists.' });
  }

  if (!Array.isArray(fonts) || fonts.length < 2) {
    return res.status(400).json({ error: 'At least 2 fonts required.' });
  }

  // ✅ Verify all font IDs exist
  const validFontIds = db
    .prepare(`SELECT id FROM fonts WHERE id IN (${fonts.map(() => '?').join(',')})`)
    .all(fonts.map(f => f.fontId))
    .map(row => row.id);

  if (validFontIds.length !== fonts.length) {
    return res.status(400).json({ error: 'One or more selected fonts do not exist.' });
  }

  const insertGroup = db.prepare('INSERT INTO font_groups (title) VALUES (?)');
  const groupResult = insertGroup.run(groupTitle.trim());

  const insertLink = db.prepare(`
    INSERT INTO font_group_fonts (group_id, font_id, custom_name)
    VALUES (?, ?, ?)
  `);

  const getFontName = db.prepare('SELECT name FROM fonts WHERE id = ?');

  const insertMany = db.transaction((groupId, fonts) => {
    fonts.forEach(f => {
      const font = getFontName.get(f.fontId);
      let customName = f.customName;
      if (!customName && font) {
        customName = font.name.replace('.ttf', '');
      }
      insertLink.run(groupId, f.fontId, customName);
    });
  });

  insertMany(groupResult.lastInsertRowid, fonts);

  res.json({ success: true });
});


  // Update an existing group
router.put('/:id', (req, res) => {
  const groupId = parseInt(req.params.id);
  const { groupTitle, fonts } = req.body;

  if (!groupTitle || !groupTitle.trim()) {
    return res.status(400).json({ error: 'Group title is required.' });
  }

  // ✅ Block duplicate title (but allow same title for *this* group)
  const existing = db
    .prepare('SELECT id FROM font_groups WHERE LOWER(title) = ? AND id != ?')
    .get(groupTitle.trim().toLowerCase(), groupId);

  if (existing) {
    return res.status(400).json({ error: 'Another group already uses this title.' });
  }

  if (!Array.isArray(fonts) || fonts.length < 2) {
    return res.status(400).json({ error: 'At least 2 fonts required.' });
  }

  // Inside your PUT logic:
  const validFontIds = db
    .prepare(`SELECT id FROM fonts WHERE id IN (${fonts.map(() => '?').join(',')})`)
    .all(fonts.map(f => f.fontId))
    .map(row => row.id);

  if (validFontIds.length !== fonts.length) {
    return res.status(400).json({ error: 'One or more selected fonts do not exist.' });
  }


  // ✅ Update the title
  db.prepare('UPDATE font_groups SET title = ? WHERE id = ?').run(
    groupTitle.trim(),
    groupId
  );

  // ✅ Remove existing font links
  db.prepare('DELETE FROM font_group_fonts WHERE group_id = ?').run(groupId);

  // ✅ Insert new font links
  const insertLink = db.prepare(`
    INSERT INTO font_group_fonts (group_id, font_id, custom_name)
    VALUES (?, ?, ?)
  `);

  const getFontName = db.prepare('SELECT name FROM fonts WHERE id = ?');

  const insertMany = db.transaction((groupId, fonts) => {
    fonts.forEach((f) => {
      let customName = f.customName;
      if (!customName) {
        const font = getFontName.get(f.fontId);
        customName = font.name.replace('.ttf', '');
      }
      insertLink.run(groupId, f.fontId, customName);
    });
  });

  insertMany(groupId, fonts);

  res.json({ success: true });
});


  // Get groups with font custom names
  router.get('/', (req, res) => {
  const groups = db.prepare('SELECT * FROM font_groups').all();

  const linkStmt = db.prepare(`
    SELECT f.*, fgf.custom_name 
    FROM font_group_fonts fgf
    JOIN fonts f ON fgf.font_id = f.id
    WHERE fgf.group_id = ?
  `);

  const result = groups.map(group => ({
    id: group.id,
    title: group.title,
    created_at: group.created_at,
    fonts: linkStmt.all(group.id)
  }));

  res.json(result);
});


  router.delete('/:id', (req, res) => {
    const groupId = req.params.id;
    db.prepare('DELETE FROM font_group_fonts WHERE group_id = ?').run(groupId);
    db.prepare('DELETE FROM font_groups WHERE id = ?').run(groupId);
    res.json({ success: true });
  });

  return router;
};
