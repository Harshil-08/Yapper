import { Server } from "socket.io";
import Message from "./models/message.js";

/** App-wide: userId -> number of active socket connections (tabs / devices) */
const globalPresence = new Map();

function getGlobalOnlineUserIds() {
	return [...globalPresence.keys()];
}

function addGlobalPresence(io, userId) {
	const uid = String(userId);
	const prev = globalPresence.get(uid) || 0;
	globalPresence.set(uid, prev + 1);
	if (prev === 0) {
		io.emit("user_presence_global", { userId: uid, online: true });
	}
}

function removeGlobalPresence(io, userId) {
	const uid = String(userId);
	const prev = globalPresence.get(uid) || 0;
	const next = prev - 1;
	if (next <= 0) {
		globalPresence.delete(uid);
		io.emit("user_presence_global", { userId: uid, online: false });
	} else {
		globalPresence.set(uid, next);
	}
}

export const handleWebsocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: true,
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id);

		socket.on("presence_identify", ({ userId }) => {
			if (!userId) return;

			const prev = socket.data.presenceUserId;
			if (prev && String(prev) === String(userId)) {
				socket.emit("presence_snapshot_global", {
					onlineUserIds: getGlobalOnlineUserIds(),
				});
				return;
			}

			if (prev && String(prev) !== String(userId)) {
				removeGlobalPresence(io, prev);
			}

			socket.data.presenceUserId = userId;
			addGlobalPresence(io, userId);
			socket.emit("presence_snapshot_global", {
				onlineUserIds: getGlobalOnlineUserIds(),
			});
		});

		socket.on("join_room", async ({ chatId, page, userId }) => {
			if (!userId) {
				console.warn("join_room missing userId");
			}

			const prevChat = socket.data.chatId;
			if (prevChat && String(prevChat) !== String(chatId)) {
				socket.leave(prevChat);
			}

			socket.data.chatId = chatId;
			socket.data.userId = userId;

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
			if (socket.data.presenceUserId) {
				removeGlobalPresence(io, socket.data.presenceUserId);
			}
		});
	});
};
