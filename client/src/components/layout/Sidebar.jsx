import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useChat } from "../../contexts/ChatContext.jsx";

const Sidebar = () => {
	const [chats, setChats] = useState([]);
	const { setSelectedChat } = useChat();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await axios.get("/api/chats/user-chats", { withCredentials: true });
				if (response.data.success) {
					setChats(response.data.chats);
				}
			} catch (error) {
				console.error("Failed to fetch chats:", error.message);
			}
		};
		fetchChats();
	}, []);

	const handleChatClick = (chat) => {
		setSelectedChat(chat);
		navigate(`/chat/${chat.name}`);
	};

	return (
		<div className="flex flex-col h-full w-64 bg-white text-teal-900 border-r border-teal-300 shadow-md">
			<div className="flex-1 overflow-y-auto p-4">
				<h2 className="font-semibold text-teal-700 text-lg mb-4">Chats</h2>
				{chats.map((chat) => (
					<div
						key={chat._id}
						onClick={() => handleChatClick(chat)}
						className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-teal-100 transition"
					>
						<div className="flex items-center">
							<img
								src={chat.avatar?.url || 'https://via.placeholder.com/150'}
								alt={`${chat.name} profile`}
								className="w-10 h-10 rounded-full mr-3"
							/>
							<span className="font-semibold">{chat.name}</span>
						</div>
						{chat.unread > 0 && (
							<span className="text-xs font-semibold bg-teal-500 text-white px-2 py-1 rounded-full">
								{chat.unread}
							</span>
						)}
					</div>
				))}
			</div>
			<div className="p-4 bg-teal-600 text-white sticky bottom-0">
				<div className="flex items-center p-3 bg-teal-700 rounded-lg mb-2 shadow">
					<img
						src="https://via.placeholder.com/40"
						alt="User profile"
						className="w-10 h-10 rounded-full mr-3"
					/>
					<div>
						<p className="font-semibold">User</p>
					</div>
				</div>

				<button
					className="w-full py-2 text-sm font-semibold bg-teal-500 rounded-lg hover:bg-teal-400 transition duration-150"
					onClick={() => {
						console.log('Logout');
					}}
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
