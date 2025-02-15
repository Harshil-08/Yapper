import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MembersList from "./MembersList";
import { useChat } from "../../contexts/ChatContext.jsx";

const AppLayout = (WrappedComponent) => {
	const HOC = (props) => {
		const { selectedChat } = useChat();
		const location = useLocation();

		const isChatPage = location.pathname.startsWith("/chat");

		return (
			<div className="flex flex-col h-screen">
				<Header />

				<div className="flex flex-1 overflow-hidden">
					<div className="border-r border-gray-200 overflow-y-auto">
						<Sidebar />
					</div>

					<div className="flex-1 overflow-y-auto">
						<WrappedComponent {...props} chat={selectedChat} />
					</div>

					{isChatPage && selectedChat && (
						<div className="border-l border-gray-200 overflow-y-auto">
							<MembersList chatId={selectedChat._id} />
						</div>
					)}
				</div>
			</div>
		);
	};
	return HOC;
};

export default AppLayout;
