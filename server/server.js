import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import studentRoutes from "./routes/student.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);

// Database Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Serve static files (if needed)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});