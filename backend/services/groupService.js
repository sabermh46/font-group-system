class GroupService {
  constructor(groupRepository, fontRepository) {
    this.groupRepository = groupRepository;
    this.fontRepository = fontRepository;
  }

  createGroup(title, fonts) {
    this.validateGroup(title, fonts);
    
    const group = this.groupRepository.create(title);
    this.addFontsToGroup(group.lastInsertRowid, fonts);
    return group;
  }

  updateGroup(id, title, fonts) {
    this.validateGroup(title, fonts);
    
    this.groupRepository.update(id, title);
    this.groupRepository.deleteGroupFonts(id);
    this.addFontsToGroup(id, fonts);
  }

  getAllGroups() {
    const groups = this.groupRepository.findAll();
    return groups.map(group => ({
      ...group,
      fonts: this.groupRepository.findFontsByGroupId(group.id)
    }));
  }

  deleteGroup(id) {
    this.groupRepository.deleteGroupFonts(id);
    return this.groupRepository.delete(id);
  }

  // Private methods
  validateGroup(title, fonts) {
    if (!title.trim()) throw new Error('Group title is required');
    if (!Array.isArray(fonts) || fonts.length < 2) {
      throw new Error('At least 2 fonts required');
    }

    const fontIds = fonts.map(f => f.fontId);
    const validFonts = this.fontRepository.findAll().filter(f => 
      fontIds.includes(f.id)
    );
    
    if (validFonts.length !== fonts.length) {
      throw new Error('One or more fonts are invalid');
    }
  }

  addFontsToGroup(groupId, fonts) {
    const transaction = this.groupRepository.db.transaction(() => {
      fonts.forEach(font => {
        const customName = font.customName || 
          this.getDefaultFontName(font.fontId);
        this.groupRepository.addFontToGroup(
          groupId, 
          font.fontId, 
          customName
        );
      });
    });
    transaction();
  }

  getDefaultFontName(fontId) {
    const font = this.fontRepository.findById(fontId);
    return font.name.replace('.ttf', '');
  }
}

module.exports = GroupService;