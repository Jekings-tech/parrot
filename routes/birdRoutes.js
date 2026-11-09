const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { getBirds, addBird, editBird, deleteBird } = require('../controllers/birdController');

router.get('/', getBirds);
router.post('/', upload.array('images', 10), addBird);

// NEW: Put route for editing
router.put('/:id', upload.array('images', 10), editBird);

router.delete('/:id', deleteBird);

module.exports = router;