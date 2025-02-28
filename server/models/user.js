import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
	{
		name:{
			type:String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: validator.isEmail,
				message: "Please provide a valid email!",
			},
		},
		password: {
			type: String,
			required: true,
		},
		bio:{
			type: String,
      default:"",
		},
		avatar: {
			public_id: {
				type: String,
				default: "default-avatar-id",
			},
			url: {
				type: String,
				default: "https://avatar.iran.liara.run/public",
			},
		},
		accessToken: {
			type: String,
	},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model("User", UserSchema);
export default User;
