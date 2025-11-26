require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");

async function createOrResetAdmin() {
  const email = "admin@gokin.test";
  const newPassword = "123456";

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  });

  let user = await User.findOne({ email });

  if (!user) {
    console.log("Admin tidak ditemukan. Membuat admin baru...");
    const hash = await bcrypt.hash(newPassword, 10);
    await User.create({
      email,
      password: hash,
      role: "admin",
      isAdmin: true,
    });
    console.log("Admin berhasil dibuat!");
  } else {
    console.log("Admin ditemukan. Reset password...");
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    console.log("Password admin berhasil direset!");
  }

  console.log("Email   :", email);
  console.log("Password:", newPassword);

  mongoose.connection.close();
}

createOrResetAdmin();
