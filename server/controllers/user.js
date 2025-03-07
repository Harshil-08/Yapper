import User from "../models/user.js";
import Chat from "../models/chat.js";
import { emitEvent, ALERT, REFETCH_CHATS } from "../utils/emitEvent.js";

export const createDMChat = async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		return res.status(400).json({ message: "Please provide a user id to chat with." });
	}

	if (userId.toString() === req.user._id.toString()) {
		return res.status(400).json({ message: "You cannot chat with yourself." });
	}

	try {
		const user = await User.findById(userId, "name username");
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		let chat = await Chat.findOne({
			name: user.username,
			groupChat: false,
			members: [req.user._id, userId],
			joinLink: undefined,
		}).populate("members", "name username avatar");

		if (chat) {
			return res.status(200).json({
				success: true,
				chat,
				message: "Chat already exists",
			});
		}

		chat = await Chat.create({
			name: user.username,
			groupChat: false,
			members: [req.user._id, userId],
			joinLink: undefined,
		});

		await chat.save();

		emitEvent(req, ALERT, [req.user._id, userId], `Group chat "${user.name}" created successfully`);
		emitEvent(req, REFETCH_CHATS, [req.user._id, userId]);

		return res.status(201).json({
			success: true,
			chat,
			message: "Direct message chat created successfully",
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to create DM chat", error: error.message });
	}
};

export const searchUser = async (req, res) => {
  const { name } = req.query;
  try {
    const users = await User.find({ 
      username: { $regex: name, $options: "i" } 
    }).select("username avatar");

    if (users.length === 0) {
      return res.status(200).json({ message: "No user found" });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({message: "Failed to search for users",error: error.message });
  }
};

