import React, { useState } from "react";
import AppLayout from "../components/layout/AppLayout";

const Chat = ({ chat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center flex-1 bg-gray-50">
        <p className="text-teal-500 font-semibold">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 bg-white shadow-md border border-teal-300">
      <div className="p-4 text-lg font-bold">
        {chat.name}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-teal-500 italic">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <span className="font-semibold text-teal-700">{msg.sender}:</span>{" "}
              <span className="text-teal-900">{msg.content}</span>
              <span className="text-xs text-teal-500 ml-2">{msg.timestamp}</span>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center bottom-0 p-4">
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
