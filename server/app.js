import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";
import userRouter from "./routes/user.js";
import { auth } from "./middlewares/auth.js"
import path from "path";
import http from "http"
import { handleWebsocket } from './socket.js';


const app = express();
const server = http.createServer(app);
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

app.use('/api/auth', authRouter);
app.use('/api/chats', auth, chatRouter);
app.use('/api/user', auth, userRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

handleWebsocket(server)
server.listen(PORT, () => {
	try {
		mongoose.connect(DB_URI);
		console.log("Database connected successfully!");
	} catch (error) {
		console.log(`Error connecting to server: ${error.message}`);
	}

	console.log(`Server listening on port ${PORT}`);
});

