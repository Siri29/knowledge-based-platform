const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedData = require('../utils/seedData');

dotenv.config();

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    await seedData();
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();