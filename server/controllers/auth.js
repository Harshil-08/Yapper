import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user.js";

export const signup = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		if (!username || !email || !password) {
			return res.status(401).json({ message: "Invalid credentials!" });
		}

		const existingUsername = await User.findOne({ username });
		const existingEmail = await User.findOne({ email });

		if (existingUsername) {
			return res.status(403).json({
				message: "Username already exisits!",
				success: false,
			});
		}
		if (existingEmail) {
			return res.status(403).json({
				message: "Email already exisits!",
				success: false,
			});
		}

		const salt = 12;
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		await user.save();

		res
			.status(201)
			.json({ message: "User created successfully!", success: true });
	} catch (error) {
		console.log(error.message);
		res.status(500).send({ message: error.message, success: false });
	}
};

export const login = async (req, res) => {
	const { email, password, remember } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(401)
				.json({ message: "Invalid credentials!", success: false });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ message: "Invalid credentials!", success: false });
		}

		const { password: hashedPassword, role, ...validatedUser } = user._doc;

		const token = jwt.sign(
			{ id: validatedUser._id, role: validatedUser.role },
			process.env.TOKEN_SECRET,
			{ expiresIn: remember ? "30d" : "1d" },
		);

		user.accessToken = token;
		await user.save();

		res
			.cookie("access_token", token, {
				httpOnly: true,
				maxAge: remember ? 1024 * 60 * 60 * 24 * 30 : 1024 * 60 * 60 * 24,
				sameSite: "None",
				secure: true,
			})
			.status(200)
			.json({
				message: "Sign in successful",
				data: validatedUser,
				success: true,
			});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: "Internal server error!", success: false });
	}
};

export const googleAuth = async (req, res) => {
	try {
		const existingUser = await User.findOne({ email: req.body.email });

		if (existingUser) {
			const { password: hashedPassword, role, ...user } = existingUser._doc;

			res
				.cookie("access_token", existingUser.accessToken, {
					httpOnly: true,
					maxAge: 1024 * 60 * 60 * 24 * 30,
					sameSite: "None",
					secure: true,
				})
				.status(200)
				.json({
					message: "Google Authentication successful",
					data: user,
					success: true,
				});
		} else {
			const generatedPassword =
				Math.random().toString(36).slice(-8) +
				Math.random().toString(36).slice(-8);

			const hashedGeneratedPassword = await bcrypt.hash(generatedPassword, 12);

			const newUser = new User({
				username:
					req.body.name.split(" ").join("").toLowerCase() +
					Math.floor(Math.random() * 1000).toString(),
				email: req.body.email,
				password: hashedGeneratedPassword,
				profilePicture: req.body.photo,
			});

			const token = jwt.sign(
				{ id: newUser._id, role: newUser.role },
				process.env.TOKEN_SECRET,
				{
					expiresIn: "30d",
				},
			);

			newUser.accessToken = token;

			await newUser.save();

			const { password: hashedPassword, role, ...user } = newUser._doc;

			res
				.cookie("access_token", token, {
					httpOnly: true,
					maxAge: 1024 * 60 * 60 * 24 * 30,
					sameSite: "None",
					secure: true,
				})
				.status(200)
				.json({
					message: "Google Authentication successful",
					data: user,
					success: true,
				});
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: "Internal server error!", success: false });
	}
};

export const signout = (req, res) => {
	res
		.clearCookie("access_token")
		.status(200)
		.json({ message: "Logged out successfully!" });
};
