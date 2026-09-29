import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const marketplaceSchema = new mongoose.Schema({}, { strict: false });
const batchSchema = new mongoose.Schema({}, { strict: false });

const Listing = mongoose.model('MarketplaceListing', marketplaceSchema, 'marketplacelistings');
const Batch = mongoose.model('WoolBatch', batchSchema, 'woolbatches');

async function fixImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB. Updating images...');
  
  // Replace unsplash images with our authentic honey image
  const listings = await Listing.find({ imageUrl: /unsplash/i });
  for (const doc of listings) {
    await Listing.updateOne({ _id: doc._id }, { $set: { imageUrl: '/honey-hero.jpg' } });
  }
  console.log(`Updated ${listings.length} listings`);

  const batches = await Batch.find({ images: /unsplash/i });
  for (const doc of batches) {
    const newImages = doc.toObject().images.map(img => 
      img.includes('unsplash') ? '/honey-hero.jpg' : img
    );
    await Batch.updateOne({ _id: doc._id }, { $set: { images: newImages } });
  }
  console.log(`Updated ${batches.length} batches`);

  mongoose.disconnect();
}

fixImages().catch(console.error);
