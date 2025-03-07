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
		avatar: {
			public_id: {
				type: String,
				default: "default-avatar-id",
			},
			url: {
				type: String,
				default: "https://avatar.iran.liara.run/public/job/operator/male",
			},
		},
		joinLink: {
			type: String,
			unique: true,
			sparse: true,
		},
	},
	{ 
		timestamps: true
	}
)

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
