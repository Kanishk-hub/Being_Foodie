import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port =process.env.PORT || 4000;

//middlewares
app.use(express.json());

// CORS - Allow all origins temporarily for debugging
app.use(cors());

// Additional CORS preflight headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, token");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// DB connection
connectDB().catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
