import mongoose, { Types } from "mongoose";

const ChatSchema = new mongoose.Schema(
	{
		name:{
			type: String,
			required: true,
		},
		groupChat:{
			type: Boolean,
			default:false,
		},
		admin:{
			type: Types.ObjectId,
			ref:"User",
		},
		members:[
			{
				type: Types.ObjectId,
				ref:"User",
			}
		],
		joinLink: {
			type: String,
			unique: true,
			required: function() { return this.groupChat; },
		},
	},
	{ 
		timestamps: true
	}
)

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
