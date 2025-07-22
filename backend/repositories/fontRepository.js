class FontRepository {
  constructor(db) {
    this.db = db;
  }

  create(name, filePath) {
    const stmt = this.db.prepare(
      'INSERT INTO fonts (name, file_path) VALUES (?, ?)'
    );
    return stmt.run(name, filePath);
  }

  findAll() {
    const stmt = this.db.prepare('SELECT * FROM fonts');
    return stmt.all();
  }

  findById(id) {
    const stmt = this.db.prepare('SELECT * FROM fonts WHERE id = ?');
    return stmt.get(id);
  }

  delete(id) {
    const stmt = this.db.prepare('DELETE FROM fonts WHERE id = ?');
    return stmt.run(id);
  }

  isLinkedToGroups(id) {
    const stmt = this.db.prepare(
      'SELECT COUNT(*) as count FROM font_group_fonts WHERE font_id = ?'
    );
    return stmt.get(id).count > 0;
  }
}

module.exports = FontRepository;