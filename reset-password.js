// reset-password.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gokin_db';
const email = process.argv[2];       // contoh: admin@gokin.test
const newPassword = process.argv[3]; // contoh: 123456

if (!email || !newPassword) {
  console.error('Usage: node reset-password.js <email> <newPassword>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' }); // flexible
  const User = mongoose.model('User', userSchema);

  const saltRounds = 10;
  const hash = await bcrypt.hash(newPassword, saltRounds);

  const res = await User.findOneAndUpdate(
    { email },
    { $set: { password: hash } }, // ubah sesuai field di DB (password / passwordHash)
    { new: true }
  );

  if (!res) {
    console.log('User not found:', email);
  } else {
    console.log('Password updated for', email);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
