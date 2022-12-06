import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./server/routes/user.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());

//routes
app.use("/user", userRoutes);

//mongoose
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to mongoDB"))
    .catch((error) => console.error(error));

//mongoose.set('sanitizeFilter', true);

//port
app.listen(port, () => console.log(`listening on port: ${port}`));
