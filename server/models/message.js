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
	},
	{ 
		timestamps: true
	}
)

const Message = mongoose.model("Message", MessageSchema);
export default Message;
