class FontController {
  constructor(fontService) {
    this.fontService = fontService;
  }

  uploadFont = async (req, res) => {
    try {
      await this.fontService.uploadFont(req.file);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getFonts = async (req, res) => {
    try {
      const fonts = await this.fontService.getAllFonts();
      res.json(fonts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteFont = async (req, res) => {
    try {
      await this.fontService.deleteFont(req.params.id);
      res.json({ success: true });
    } catch (error) {
      const status = error.message.includes('linked') ? 400 : 404;
      res.status(status).json({ error: error.message });
    }
  };
}

module.exports = FontController;