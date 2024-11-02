import mongoose, { Types } from "mongoose";

const RequestSchema = new Schema(
	{
		status:{
			type: String,
			default:"pending",
			enum:["pending","accepted","rejected"],
		},
		sender:{
			type: Types.ObjectId,
			ref:"User",
			required: true,
		},
		receiver:{
			type: Types.ObjectId,
			ref:"User",
			required: true,
		},
	},
	{ 
		timestamps: true
	}
)

const Request = mongoose.model("Request", RequestSchema);
export default Request;

