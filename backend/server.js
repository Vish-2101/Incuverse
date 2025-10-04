import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/User.route.js";
import authRoutes from './routes/auth.route.js'
import loginRoutes from './routes/login.route.js'
import transactionRoutes from './routes/transaction.route.js'
import balanceRoutes from './routes/balance.route.js'
import carbonCreditsRoutes from './routes/carbonCredits.route.js'
import userProfileRoutes from './routes/userProfile.route.js'

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// DB Connection
connectDB();
app.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

// Routes
app.use("/api/users", userRoutes);
app.use('/api/verify', authRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/carbon-credits', carbonCreditsRoutes);
app.use('/api/profile', userProfileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
