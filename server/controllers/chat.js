import User from "../models/user.js";
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
				avatar = otherMember?.avatar;
				name = otherMember?.name;
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
			.populate({
				path: "members", 
				select: "username avatar", 
				model: "User" 
			})
			.populate({
				path: "admin", 
				select: "username avatar", 
				model: "User"  
			});

		if (!chat) {
			return res.status(404).json({ message: "Chat not found" });
		}

		const members = chat.members.map(member => ({
			_id: member._id,
			username: member.username,  
			avatar: member.avatar.url, 
		}));

		const admin = chat.admin
			? {
				_id: chat.admin._id,
				username: chat.admin.username,  
				avatar: chat.admin.avatar.url, 
			}
			: null;

		res.status(200).json({
			success: true,
			admin,
			members,
		});
	} catch (error) {
		res.status(500).json({ message: "Failed to retrieve chat members", error: error.message });
	}
};

export const addMembers = async(req,res)=>{
	const {chatId, members} = req.body;

	try{
		const chat = await Chat.findById(chatId);
		if(!members || members.length < 1){
			return res.status(400).json({message: "Please provide members"});
		}

		if (!chat) {
			return res.status(400).json({ message: "Chat not found" });
		}

		if (!chat.groupChat) {
			return res.status(400).json({ message: "This is not a group chat" });
		}

		if (chat.admin.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Only the admin can add members" });
		}

		const allNewMembers = await Promise.all(
			members.map((i)=> User.findById(i, "name"))
		);

		const uniqueMembers = allNewMembers
		.filter((i)=>!chat.members.includes(i._id.toString()))
		.map((i)=>i._id)

		chat.members.push(...uniqueMembers.map((i)=> i._id));

		await chat.save();

		res.status(200).json({
			success: true,
			message: "Members added successfully",
		});
	} catch{
		res.status(500).json({message: "Failed to add members", error: error.message});
	}
};

export const removeMembers = async(req,res)=>{
	const { userId, chatId } = req.body;

	try{	
		const [chat, user] = await Promise.all([
			Chat.findById(chatId),
			User.findById(userId, "name")
		]);

		if(!chat){
			return res.status(400).json({ message: "Chat not found" })
		}
		if(!user){
			return res.status(400).json({ message: "User not found" })
		}
		if (!chat.groupChat) {
			return res.status(400).json({ message: "This is not a group chat" });
		}
		if (chat.admin.toString() !== req.user._id.toString()) {
			return res.status(403).json({ message: "Only the admin can remove members" });
		}
		if(chat.members.length<=3){
			return res.status(400).json({message: "Group must have atleast 3 members" })
		}

		chat.members = chat.members.filter(
			(members)=> members.toString() !== userId.toString()
		);

		await chat.save();

		res.status(200).json({
			success: true,
			message: "Members removed successfully",
		});
	}catch{
		res.status(500).json({message: "Failed to remove members", error: error.message});
	}
}