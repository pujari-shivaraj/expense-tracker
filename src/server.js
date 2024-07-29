import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";




dotenv.config();

connectDB()
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

//routes
app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);

 



app.listen(PORT, () =>  console.log(`server started at localhost:${PORT}`));
