import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AppLayout from "../components/layout/AppLayout";
import { useUser } from "../contexts/UserContext";

const Chat = ({ chat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    if (!chat) return;

    socketRef.current = io("http://localhost:3000", { transports: ["websocket"] });
    socketRef.current.emit("join_room", { chatId: chat._id, page: 1 });
    socketRef.current.on("load_messages", ({ loadedMessages, hasMore: more }) => {
      setMessages(loadedMessages);
      setHasMore(more);
      setPage(1);
      scrollToBottom();
    });

    socketRef.current.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    socketRef.current.on("load_more_messages", ({ loadedMessages, hasMore: more }) => {
      if (containerRef.current) {
        const container = containerRef.current;
        const oldScrollHeight = container.scrollHeight;
        setMessages((prevMessages) => [...loadedMessages, ...prevMessages]);
        setHasMore(more);
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - oldScrollHeight;
        }, 100);
      }
    });

    return () => {
      socketRef.current.off("load_messages");
      socketRef.current.off("receive_message");
      socketRef.current.off("load_more_messages");
    };
  }, [chat]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore) {
        const nextPage = page + 1;
        socketRef.current.emit("load_more", { chatId: chat._id, page: nextPage });
        setPage(nextPage);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, chat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSend = () => {
    if (message.trim() && chat && user) {
      const newMessage = {
        sender: user._id,
        content: message,
        chat: chat._id,
      };

      socketRef.current.emit("send_message", newMessage);
      setMessage("");
    }
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gray-50">
        <p className="text-teal-500 font-semibold">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 bg-white shadow-md border border-teal-300">
      <div className="p-4 text-lg font-bold">{chat.name}</div>
      {/* Message Container */}
      <div ref={containerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <p className="text-teal-500 italic">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src={msg.sender?.avatar?.url || "https://via.placeholder.com/100"}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="bg-gray-100 p-3 rounded-lg break-words whitespace-pre-wrap max-w-[80%]">
                <span className="font-semibold text-teal-700">
                  {msg.sender?.username || "You"}
                </span>
                <p className="text-teal-900">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Box */}
      <div className="flex items-center bottom-0 p-4 border-t border-teal-300">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-l-lg border border-teal-300 focus:ring-2 focus:ring-teal-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-r-lg hover:bg-teal-500"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AppLayout(Chat);
