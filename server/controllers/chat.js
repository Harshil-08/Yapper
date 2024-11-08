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
