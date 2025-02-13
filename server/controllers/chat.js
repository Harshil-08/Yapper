import User from "../models/user.js";
import Chat from "../models/chat.js";
import { emitEvent, ALERT, REFETCH_CHATS, NEW_ATTACHEMENT, NEW_MESSAGE_ALERT} from "../utils/emitEvent.js";
import { nanoid } from "nanoid";
import Message from "../models/message.js";
import { deleteFromCoudinary } from "../utils/deleteFromCloundinary.js";

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
		emitEvent(req, ALERT, allMembers,`Welcome to ${name} group`);
		emitEvent(req, REFETCH_CHATS, members)

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

export const joinGroupChat = async (req, res) => {
    const { joinLink } = req.params;
    try {
        const chat = await Chat.findOne({ joinLink });

        if (!chat) {
            return res.status(404).json({ message: "Invalid join link or chat not found"});
        }
        if (!chat.groupChat) {
            return res.status(400).json({ message: "This link is not for a group chat"});
        }
        if (chat.members.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already a member of this group"});
        }

        chat.members.push(req.user._id);
        await chat.save();

        const user = await User.findById(req.user._id, "username");

        emitEvent(
            req,
            ALERT,
            chat.members,
            `${user.username} has joined the group`
        );

        emitEvent(
            req,
            REFETCH_CHATS,
            chat.members
        );

        res.status(200).json({
            success: true,
            message: "Successfully joined the group chat"
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to join group chat", error: error.message});
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

		const members = chat.members
		.filter(member => member._id.toString() !== chat.admin._id.toString())
		.map(member => ({
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
			members.map((i)=> User.findById(i, "username"))
		);

		const uniqueMembers = allNewMembers
		.filter((i)=>!chat.members.includes(i._id.toString()))
		.map((i)=>i._id)

		chat.members.push(...uniqueMembers.map((i)=> i._id));

		await chat.save();

		const allUsersName = allNewMembers.map((i)=> i.username).join(",");

		emitEvent(
			req,
			ALERT,
			chat.members,
			`${allUsersName} have been added to ${chat.name} by ${req.user.username}`
		);

		emitEvent(
			req,
			REFETCH_CHATS,
			chat.members,
		);

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
			User.findById(userId, "username")
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

		emitEvent(
			req,
			ALERT,
			chat.members,
			`${user.username} has been removed from the group`
		)

		emitEvent(req,REFETCH_CHATS,chat.members);

		res.status(200).json({
			success: true,
			message: "Members removed successfully",
		});
	}catch{
		res.status(500).json({message: "Failed to remove members", error: error.message});
	}
}

export const leaveGroup = async(req,res)=>{
	const { chatId } = req.params;

	try{	
		const chat = await Chat.findById(chatId);
		if(!chat){
			return res.status(400).json({ message: "Chat not found" })
		}
		if (!chat.groupChat) {
			return res.status(400).json({ message: "This is not a group chat" });
		}

		if(chat.admin.toString()=== req.user.toString()){
			return res.status(400).json({ message: "Admin cannot leave the group"})
		}
		if(chat.members.length<=3){
			return res.status(400).json({message: "Group must have atleast 3 members" })
		}

		chat.members = chat.members.filter(
			(members)=> members.toString() !== req.user._id.toString()
		);

		await chat.save();

		emitEvent(req,ALERT,chat.members,`${req.user.username} has left the group`);

		res.status(200).json({
			success: true,
			message: "Member left successfully",
		});
	}catch{
		res.status(500).json({message: "Failed to leave group", error: error.message});
	}
}

export const attachments = async(req,res)=>{
	const { chatId } = req.body;

	try{	
		const [chat, user] = await Promise.all([
			Chat.findById(chatId),
			User.findById(req.user, "username avatar")
		]);

		if(!chat){
			return res.status(400).json({ message: "Chat not found" })
		}

		const files = req.files || [];
		const attachments = [];

		const messageForDB = {
			content:"",
			attachments,
			sender:user._id,
			chat:chatId
		}
		const messageForRealTime = {
			...messageForDB,
			sender:{
				_id : user._id,
				name: user.username,
				avatar: user.avatar,
			},
		}

		const message = await Message.create(messageForDB);

		if(files.length < 1) {
			return res.status(400).json({message:"Please provide attachments"});
		}

		emitEvent(req,NEW_ATTACHEMENT,chat.members,{
			message:messageForRealTime,
			chatId
		});

		emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId})

		await chat.save();

		res.status(200).json({
			success: true,
			message,
		});
	}catch(error){
		res.status(500).json({message: "Failed to upload attachments", error: error.message});
	}
}

export const getChatDetails = async(req,res)=>{
	try{	
		if(req.query.populate === "true"){
			const chat = await Chat.findById(req.params.id).populate("members","username avatar").lean();
			if(!chat) return res.status(402).json({message: "Chat not found"});

			chat.members = chat.members.map(({_id, username, avatar})=>({
				_id,
				username,
				avatar: avatar.url
			}))

			res.status(200).json({
				success: true,
				chat,
			});
		}else{
			const chat = await Chat.findById(req.params.id);
			if(!chat) return res.status(402).json({message: "Chat not found"})
			res.status(200).json({
				success: true,
				chat,
			});
		}
	}catch{
		res.status(500).json({message: "Failed to get details", error: error.message});
	}
}

export const renameGroup = async(req,res)=>{
	try{	
		const chatId = req.params.id;
		const {name} = req.body;

		const chat = await Chat.findById(chatId)
		if(!chat) return res.status(402).json({message: "Chat not found"});
		if(!chat.groupChat) return res.status(402).json({message:"Not a group chat"});

		if(chat.admin.toString()!== req.user.toString()){
			return res.status(402).json({message:"You are not allowed to rename the group"});
		}
		chat.name = name;
		await chat.save();

		emitEvent(req,REFETCH_CHATS,chat.members);
		return res.status(200).json({
			success:true,
			message:"Group renamed successfully"
		})
	}catch{
		res.status(500).json({message: "Failed to rename the group", error: error.message});
	}
}

export const deleteChat = async(req,res)=>{
	try{	
		const chatId = req.params.id;

		const chat = await Chat.findById(chatId)
		if(!chat) return res.status(402).json({message: "Chat not found"});
		if(!chat.groupChat) return res.status(402).json({message:"Not a group chat"});

		if(chat.groupChat && chat.admin.toString()!== req.user.toString()){
			return res.status(402).json({message:"You are not allowed to delete the group"});
		}

		const messageWithAttachments = await Message.find({
			chat:chatId,
			attachments:{ $exists: true, $ne:[]},
		})

		const public_ids = [];
		messageWithAttachments.forEach(({attachments})=>
			attachments.forEach(({public_id})=>
				public_ids.push(public_id))
		);
		 
		await Promise.all([
			deleteFromCoudinary(public_ids),
			chat.deleteOne(),
			Message.deleteMany({chat:chatId}),
		]);

		emitEvent(req,REFETCH_CHATS,chat.members);
		return res.status(200).json({
			success:true,
			message:"Chat deleted successfully"
		})
	}catch{
		res.status(500).json({message: "Failed to delete the chat", error: error.message});
	}
}

export const getMessage = async(req,res)=>{
	try{	
		const chatId = req.params.id;
  	const {page = 1 } =req.query;
 		const limit = 20;

		const skip = (page - 1) * limit;
		const [message, totalMessageCount] = await Promise.all([ 
			Message.find({chat: chatId})
			.sort({ createdAt: -1})
			.skip(skip)
			.limit(limit)
			.populate("sender","username avatar")
			.lean(),
			Message.countDocuments({ chat: chatId}),
		]);

		const totalPages = Math.ceil(totalMessageCount/ limit) || 0;

		return res.status(200).json({
			success:true,
			messages: message.reverse(),
			totalPages,
		})
	}catch{
		res.status(500).json({message: "Failed to delete the chat", error: error.message});
	}
}
