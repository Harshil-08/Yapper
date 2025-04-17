import mongoose, { Types } from "mongoose";

const MessageSchema = new mongoose.Schema(
	{
		sender:{
			type: Types.ObjectId,
			ref:"User",
			required: true,
		},
		chat:{
			type: Types.ObjectId,
			ref:"Chat",
			required: true,
		},
		content:{
			type: String,
		},
		attachments:[
			{
				public_id:{
					type: String,
					required: true,
				},
				url:{
					type: String,
					required: true,
				},
			}
		],
		replyTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		mentions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ 
		timestamps: true
	}
)

const Message = mongoose.model("Message", MessageSchema);
export default Message;
