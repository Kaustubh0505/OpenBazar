import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors"
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
