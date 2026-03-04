import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import foodModel from "./models/foodModel.js";
import userModel from "./models/userModel.js";

dotenv.config();

const sampleFoods = [
  {
    name: "Margherita Pizza",
    description: "Classic cheese and tomato pizza",
    price: 7.99,
    image: "1722865444288food_1.png",
    category: "Pizza",
  },
  {
    name: "Veggie Burger",
    description: "Grilled veggie patty with lettuce and tomato",
    price: 6.49,
    image: "1722865514626food_2.png",
    category: "Burger",
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine with Caesar dressing",
    price: 5.99,
    image: "1722865628915food_3.png",
    category: "Salad",
  },
  {
    name: "Sushi Platter",
    description: "Assorted sushi across 12 pieces",
    price: 14.99,
    image: "1722865668073food_4.png",
    category: "Sushi",
  },
];

const run = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.error("MONGO_URL not set. Set environment variable or .env file.");
      process.exit(1);
    }

    await connectDB();

    // Create admin user if not exists
    const adminEmail = "admin@beingfoodie.com";
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const saltRounds = Number(process.env.SALT) || 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash("Admin@1234", salt);
      await userModel.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin user created ->", adminEmail, "password: Admin@1234");
    } else {
      console.log("Admin user already exists ->", adminEmail);
    }

    // Insert sample foods (do not duplicate)
    for (const f of sampleFoods) {
      const exists = await foodModel.findOne({ name: f.name });
      if (!exists) {
        await foodModel.create(f);
        console.log("Inserted food:", f.name);
      } else {
        console.log("Food already exists, skipping:", f.name);
      }
    }

    console.log("Seeding finished.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
