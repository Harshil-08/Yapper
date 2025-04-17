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
					.populate("sender", "name username avatar")
					.populate({
						path: "replyTo",
						populate: {
							path: "sender",
							select: "name username avatar"
						}
					})
					.lean();

				const totalMessages = await Message.countDocuments({ chat: chatId });
				const hasMore = totalMessages > page * pageSize;

				socket.emit("load_messages", { 
					loadedMessages: messages.reverse().map(msg => ({ ...msg, timestamp: msg.createdAt })), 
					hasMore 
				});
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
					.populate("sender", "name username avatar")
					.populate("replyTo")
					.lean();

				const totalMessages = await Message.countDocuments({ chat: chatId });
				const hasMore = totalMessages > page * pageSize;

				socket.emit("load_more_messages", { 
					loadedMessages: messages.reverse().map(msg => ({ ...msg, timestamp: msg.createdAt })), 
					hasMore 
				});
			} catch (error) {
				console.error("Error loading more messages:", error);
			}
		});

		socket.on("send_message", async (data) => {
			const { sender, content, chat } = data;
			try {
				const newMessage = await new Message({ sender, content, chat }).save();
				const populatedMessage = await Message.findById(newMessage._id)
					.populate("sender", "name username avatar")
					.lean();
				populatedMessage.timestamp = populatedMessage.createdAt;
				io.to(chat).emit("receive_message", populatedMessage);
			} catch (error) {
				console.error("Error saving message:", error);
			}
		});

		socket.on("delete_message", async ({ messageId, chatId }) => {
			try {
				await Message.findByIdAndDelete(messageId);
				io.to(chatId).emit("message_deleted", { messageId, chatId });
			} catch (error) {
				console.error("Error deleting message:", error);
			}
		});

		socket.on("edit_message", async ({ messageId, content, chatId }) => {
			try {
				const updatedMessage = await Message.findByIdAndUpdate(
					messageId,
					{ content },
					{ new: true }
				);
				io.to(chatId).emit("message_edited", { 
					messageId, 
					content,
					chatId
				});
			} catch (error) {
				console.error("Error editing message:", error);
			}
		});	

		socket.on("reply_message", async (data) => {
			const { sender, content, chat, replyToMessageId } = data;
			try {
				const newMessage = await new Message({ 
					sender, 
					content, 
					chat,
					replyTo: replyToMessageId 
				}).save();

				const populatedMessage = await Message.findById(newMessage._id)
					.populate("sender", "name username avatar")
					.populate({
						path: "replyTo",
						populate: {
							path: "sender",
							select: "name username avatar"
						}
					})
					.lean();

				populatedMessage.timestamp = populatedMessage.createdAt;
				io.to(chat).emit("receive_message", populatedMessage);
			} catch (error) {
				console.error("Error saving reply message:", error);
			}
		});

		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
			socket.broadcast.emit("user_disconnected", socket.id);
		});
	});
};
