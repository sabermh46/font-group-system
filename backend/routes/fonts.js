const express = require('express');
const multer = require('multer');
const FontController = require('../controllers/FontController');
const FontRepository = require('../repositories/fontRepository');
const FontService = require('../services/fontService');


module.exports = (db) => {
  const router = express.Router();
  const upload = multer({ dest: 'uploads/' });
  const fontRepository = new FontRepository(db);
  const fontService = new FontService(fontRepository);
  const fontController = new FontController(fontService);

  router.post('/upload', upload.single('font'), fontController.uploadFont);
  router.get('/', fontController.getFonts);
  router.delete('/:id', fontController.deleteFont);

  return router;
};