import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
	const token = req.cookies.access_token;

	if (!token) {
		return res
			.status(401)
			.json({ message: "Unauthenticated. Please sign in first." });
	}

	jwt.verify(token, process.env.TOKEN_SECRET, async (error, user) => {
		if (error) {
			return res
				.status(401)
				.json({ message: "Session expired. Please sign in again." });
		}

		const currentUser = await User.findById(user.id);
		if (!currentUser || currentUser.accessToken !== token) {
			return res.status(401).json({
				message:
					"Current session has expired as new sign in was detected on another device",
			});
		}

		req.user = user;
		next();
	});
};
