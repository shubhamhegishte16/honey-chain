import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

async function makeAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB.');
  
  // Find the most recently created user and make them an admin
  const user = await User.findOne().sort({ createdAt: -1 });
  if (user) {
    await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
    console.log(`Successfully made ${user.name || user.email} an admin!`);
  } else {
    console.log('No users found.');
  }

  mongoose.disconnect();
}

makeAdmin().catch(console.error);
