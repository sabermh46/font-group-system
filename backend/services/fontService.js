const fs = require('fs');
const path = require('path');

class FontService {
  constructor(fontRepository, fileSystem = fs) {
    this.fontRepository = fontRepository;
    this.fileSystem = fileSystem;
    this.uploadPath = path.join(__dirname, '..', '..', 'uploads');
  }

  uploadFont(file) {
    if (path.extname(file.originalname).toLowerCase() !== '.ttf') {
      throw new Error('Only .ttf files allowed');
    }
    return this.fontRepository.create(file.originalname, file.filename);
  }

  getAllFonts() {
    return this.fontRepository.findAll();
  }

  deleteFont(id) {
    if (this.fontRepository.isLinkedToGroups(id)) {
      throw new Error('Font is linked in a group');
    }

    const font = this.fontRepository.findById(id);
    if (!font) throw new Error('Font not found');

    const filePath = path.join(this.uploadPath, font.file_path);
    if (this.fileSystem.existsSync(filePath)) {
      this.fileSystem.unlinkSync(filePath);
    }

    return this.fontRepository.delete(id);
  }
}

module.exports = FontService;