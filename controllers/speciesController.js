const Species = require('../models/Species');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// The 23 species with exact descriptions
const seedData = [
  { name: "African Grey Parrot", description: "Nicknamed the 'Einstein Bird' for extreme intelligence. Average weight 400g, 33cm long." },
  { name: "Macaw", description: "Brilliantly colored with large, powerful beaks. Lifespan up to 60 years." },
  { name: "Cockatoo", description: "Known for expressive crests and highly affectionate nature. Can live 40-60+ years." },
  { name: "Budgerigar (Budgie)", description: "Small Australian parakeet, 18-20 cm long. Excellent for beginners." },
  { name: "Amazon Parrot", description: "Stocky, medium-sized parrots known for strong voices and excellent talking ability." },
  { name: "Sun Conure", description: "Vibrant deep yellow and orange plumage. Extremely loud and social." },
  { name: "Green-Cheeked Conure", description: "Small, mostly green with a maroon belly. Quieter, suitable for apartment living." },
  { name: "Eclectus Parrot", description: "Extreme dimorphism—males are bright green, females are red. Calm and observant." },
  { name: "Indian Ringneck Parakeet", description: "Slender green parakeet with a long tail. Males have a black and rose collar." },
  { name: "Lovebird", description: "Small, stocky parrots. Known for intense pair bonds. Best kept in pairs." },
  { name: "Quaker Parrot", description: "Small-to-medium, known for building large communal nests and excellent talking ability." },
  { name: "Pionus Parrot", description: "Stocky, calm, quiet. They have a distinctive 'musky' scent." },
  { name: "Senegal Parrot", description: "Small African parrot, mostly green with a grey head. Playful and affectionate." },
  { name: "Caique Parrot", description: "Known as the 'clown of parrots' for endless energy and acrobatics." },
  { name: "Cockatiel", description: "Small Australian parrot with a distinctive crest. Gentle and easy-going." },
  { name: "Blue-and-Gold Macaw", description: "Large macaw, mostly blue and yellow. Intelligent, social, and very loud." },
  { name: "Scarlet Macaw", description: "Bold red, yellow, and blue plumage. Known for being more aggressive than other macaws." },
  { name: "Hyacinth Macaw", description: "The largest flying parrot, solid cobalt blue. Very expensive and requires specialized care." },
  { name: "Military Macaw", description: "Medium-large macaw, mostly green with red facial accents. Active and intelligent." },
  { name: "Blue-Fronted Amazon", description: "Medium Amazon, green with a blue forehead and yellow face. Charming and playful." },
  { name: "Yellow-Naped Amazon", description: "Green with a yellow patch on the nape. Exceptional talkers and highly intelligent." },
  { name: "Double Yellow-Headed Amazon", description: "Green with yellow covering the entire head. Affectionate but very loud." },
  { name: "Red-Lored Amazon", description: "Green with a bright red forehead and pale cheeks. Social, active, and good talkers." }
];

// Auto-seed function (runs on server start)
exports.seedSpecies = async () => {
  try {
    const count = await Species.countDocuments();
    if (count === 0) {
      await Species.insertMany(seedData);
      console.log('✅ 23 Species auto-seeded to database.');
    }
  } catch (err) {
    console.error('❌ Error seeding species:', err);
  }
};

// Get all species
exports.getSpecies = async (req, res) => {
  try {
    const species = await Species.find();
    res.status(200).json(species);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Upload image for a species
exports.updateSpeciesImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'bubapet_species' }, (error, result) => {
        if (error) reject(error); else resolve(result);
      });
      stream.end(req.file.buffer);
    });

    const species = await Species.findByIdAndUpdate(
      req.params.id,
      { image: result.secure_url },
      { new: true }
    );
    res.status(200).json(species);
  } catch (error) { res.status(500).json({ message: error.message }); }
};