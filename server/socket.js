import { Server } from "socket.io";
import Message from "./models/message.js";

export const handleWebsocket = (server) => {
	const io = new Server(server);
	
	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);
		
		socket.on("join_room", async ({ chatId, page }) => {
			socket.join(chatId);
			console.log(`User ${socket.id} joined room ${chatId}`);
			
			try {
				const pageSize = 20; 
				const messages = await Message.find({ chat: chatId })
					.sort({ createdAt: -1 })
					.skip((page - 1) * pageSize)
					.limit(pageSize)
					.populate("sender", "username avatar")
					.lean();
					
				const totalMessages = await Message.countDocuments({ chat: chatId });
				const hasMore = totalMessages > page * pageSize;
				
				socket.emit("load_messages", { loadedMessages: messages.reverse(), hasMore });
			} catch (error) {
				console.error("Error loading messages:", error);
			}
		});
		
		socket.on("load_more", async ({ chatId, page }) => {
			try {
				const pageSize = 20; 
				const messages = await Message.find({ chat: chatId })
					.sort({ createdAt: -1 })
					.skip((page - 1) * pageSize)
					.limit(pageSize)
					.populate("sender", "username avatar")
					.lean();
					
				const totalMessages = await Message.countDocuments({ chat: chatId });
				const hasMore = totalMessages > page * pageSize;
				
				socket.emit("load_more_messages", { loadedMessages: messages.reverse(), hasMore });
			} catch (error) {
				console.error("Error loading more messages:", error);
			}
		});
		
		socket.on("send_message", async (data) => {
			const { sender, content, chat } = data;
			try {
				const newMessage = await new Message({ sender, content, chat }).save();
				const populatedMessage = await Message.findById(newMessage._id)
					.populate("sender", "username avatar")
					.lean();
					
				console.log(populatedMessage);
				io.to(chat).emit("receive_message", populatedMessage);
			} catch (error) {
				console.error("Error saving message:", error);
			}
		});
		
		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
			socket.broadcast.emit("user_disconnected", socket.id);
		});
	});
};
