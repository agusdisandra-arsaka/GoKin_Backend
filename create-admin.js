import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// Schema Admin
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log("Usage: node create-admin.js <email> <password>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let admin = await Admin.findOne({ email });

  if (!admin) {
    console.log("Admin not found → creating new admin...");
    const hashed = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashed,
    });

    console.log("✅ Admin created successfully!");
  } else {
    console.log("Admin exists → updating password...");
    const hashed = await bcrypt.hash(password, 10);
    admin.password = hashed;
    await admin.save();

    console.log("✅ Password updated successfully!");
  }

  process.exit(0);
}

main().catch((err) => console.log(err));
