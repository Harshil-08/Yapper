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
      <>
        <Header />
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1">
            <WrappedComponent {...props} chat={selectedChat} />
          </div>
          {isChatPage && selectedChat && <MembersList chatId={selectedChat._id} />}
        </div>
      </>
    );
  };
  return HOC;
};

export default AppLayout;
