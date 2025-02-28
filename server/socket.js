import { Server } from "socket.io";
import Message from "./models/message.js";

export const handleWebsocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", async (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);

      try {
        const messages = await Message.find({ chat: roomId })
          .sort({ createdAt: 1 })
          .limit(20)
          .populate("sender", "username avatar") 
          .lean();
          
        socket.emit("load_messages", messages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    });

    socket.on("send_message", async (data) => {
      const { sender, content, chat } = data;

      try {
        const newMessage = await new Message({ sender, content, chat }).save();

        const populatedMessage = await Message.findById(newMessage._id)
          .populate("sender", "username avatar")
          .lean();
				console.log(populatedMessage)
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
