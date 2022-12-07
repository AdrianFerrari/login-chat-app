import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./server/routes/user.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client", "build")))

//routes
app.use("/user", userRoutes);
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

//mongoose
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to mongoDB"))
    .catch((error) => console.error(error));

//mongoose.set('sanitizeFilter', true);

//port
app.listen(port, () => console.log(`listening on port: ${port}`));
