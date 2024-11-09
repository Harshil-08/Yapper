import Chat from "../models/chat.js";
import { nanoid } from "nanoid";

export const newGroupChat = async (req, res) => {
	const { name, members } = req.body;

	if (!name || !members || members.length < 2) {
		return res.status(400).json({ message: "Group chat must have at least 3 members, including the admin." });
	}

	const allMembers = [...members, req.user._id];
	try {
		const chat = await Chat.create({
			name,
			groupChat: true,
			admin: req.user._id,
			members: allMembers,
			joinLink: nanoid(),
		});

		await chat.save();

		res.status(201).json({
			success:true,
			message: "Group chat created successfully",
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to create group chat", error: error.message });
	}
};

export const getMyChat = async (req, res) => {
	try {
		const chats = await Chat.find({ members: req.user._id })
			.populate("members", "name avatar")

		const formattedChats = chats.map(chat => {
			let avatar, name;

			if (chat.groupChat) {
				avatar = chat.avatar;
				name = chat.name;
			} else {
				const otherMember = chat.members.find(member => member._id.toString() !== req.user._id.toString());
				avatar = otherMember?.avatar || { url: "https://via.placeholder.com/100" };
				name = otherMember?.name || "Unknown User";
			}

			return {
				_id: chat._id,
				name,
				avatar,
				groupChat: chat.groupChat,
				members: chat.members
				.filter(member => member._id.toString() !== req.user._id.toString())
				.map(member => member._id),
			};
		});

		res.status(200).json({
			success: true,
			chats: formattedChats,
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to retrieve chats", error: error.message });
	}
};

export const getChatMembers = async (req, res) => {
	const { chatId } = req.params;

	try {
		const chat = await Chat.findById(chatId)
			.populate("members", "name avatar")
			.populate("admin", "name avatar");

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		const members = chat.members.map(member => ({
			_id: member._id,
			name: member.name,
			avatar: member.avatar,
		}));

		const admin = {
			_id: chat.admin._id,
			name: chat.admin.name,
			avatar: chat.admin.avatar,
		};

		res.status(200).json({
			success: true,
			admin,
			members,
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to retrieve chat members", error: error.message });
	}
};
