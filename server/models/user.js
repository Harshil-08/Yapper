import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
	{
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
		avatar: {
			public_id:{
      	type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			}
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
