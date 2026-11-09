const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { getSpecies, updateSpeciesImage } = require('../controllers/speciesController');

router.get('/', getSpecies);
router.put('/:id', upload.single('image'), updateSpeciesImage);

module.exports = router;