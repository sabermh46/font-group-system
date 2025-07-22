class GroupRepository {
  constructor(db) {
    this.db = db;
  }

  create(title) {
    const stmt = this.db.prepare(
      'INSERT INTO font_groups (title) VALUES (?)'
    );
    return stmt.run(title);
  }

  findAll() {
    const stmt = this.db.prepare('SELECT * FROM font_groups');
    return stmt.all();
  }

  findById(id) {
    const stmt = this.db.prepare('SELECT * FROM font_groups WHERE id = ?');
    return stmt.get(id);
  }

  update(id, title) {
    const stmt = this.db.prepare(
      'UPDATE font_groups SET title = ? WHERE id = ?'
    );
    return stmt.run(title, id);
  }

  delete(id) {
    const stmt = this.db.prepare('DELETE FROM font_groups WHERE id = ?');
    return stmt.run(id);
  }

  deleteGroupFonts(groupId) {
    const stmt = this.db.prepare(
      'DELETE FROM font_group_fonts WHERE group_id = ?'
    );
    return stmt.run(groupId);
  }

  addFontToGroup(groupId, fontId, customName) {
    const stmt = this.db.prepare(
      'INSERT INTO font_group_fonts (group_id, font_id, custom_name) VALUES (?, ?, ?)'
    );
    return stmt.run(groupId, fontId, customName);
  }

  findFontsByGroupId(groupId) {
    const stmt = this.db.prepare(`
      SELECT f.*, fgf.custom_name 
      FROM font_group_fonts fgf
      JOIN fonts f ON fgf.font_id = f.id
      WHERE fgf.group_id = ?
    `);
    return stmt.all(groupId);
  }
}

module.exports = GroupRepository;