import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js"
import { auth } from "./middlewares/auth.js"

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: ["http://localhost:5173"],
		credentials: true,
	}),
);
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/chat',auth,chatRouter);

app.listen(PORT, () => {
	try {
		mongoose.connect(DB_URI);
		console.log("Database connected successfully!");
	} catch (error) {
		console.log(`Error connecting to server: ${error.message}`);
	}

	console.log(`Server listening on port ${PORT}`);
});

