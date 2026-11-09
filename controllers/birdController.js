const Bird = require('../models/Bird');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getBirds = async (req, res) => {
  try {
    const birds = await Bird.find().populate('species', 'name');
    res.status(200).json(birds);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.addBird = async (req, res) => {
  try {
    const { name, species, age, price, description } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'bubapet_birds' }, (error, result) => {
          if (error) reject(error); else resolve(result);
        });
        stream.end(file.buffer);
      });
      imageUrls.push(result.secure_url);
    }

    const newBird = new Bird({ name, species, age, price, description, images: imageUrls });
    await newBird.save();
    res.status(201).json(newBird);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// NEW: Edit Bird
exports.editBird = async (req, res) => {
  try {
    const { name, species, age, price, description } = req.body;
    const bird = await Bird.findById(req.params.id);

    if (!bird) return res.status(404).json({ message: 'Bird not found' });

    // If new images are uploaded, upload them. Otherwise, keep the old ones.
    let imageUrls = bird.images;
    if (req.files && req.files.length > 0) {
      imageUrls = [];
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: 'bubapet_birds' }, (error, result) => {
            if (error) reject(error); else resolve(result);
          });
          stream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }

    bird.name = name || bird.name;
    bird.species = species || bird.species;
    bird.age = age || bird.age;
    bird.price = price || bird.price;
    bird.description = description || bird.description;
    bird.images = imageUrls;

    await bird.save();
    res.status(200).json(bird);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteBird = async (req, res) => {
  try {
    await Bird.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bird deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};