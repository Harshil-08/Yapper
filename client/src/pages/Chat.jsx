import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';

const Chat = () => {
  const [message, setMessage] = useState('');
  const chatName = "General Chat";

  const handleSend = () => {
    if (message.trim()) {
      // Logic to send the message
      console.log("Message sent:", message);
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-white w-2/3 shadow-lg rounded-lg">
      
      {/* Chat Header */}
      <div className="p-4 font-bold text-lg text-center">
        {chatName}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Sample Messages (replace with mapped messages from state or props) */}
        <div className="mb-2">
          <span className="font-semibold text-teal-600">User1:</span> Hello everyone!
        </div>
        <div className="mb-2">
          <span className="font-semibold text-teal-600">User2:</span> Hi! How’s it going?
        </div>
        {/* This area would be dynamically populated with messages */}
      </div>

      {/* Message Input Area */}
      <div className="flex p-4 border-t border-gray-200">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-r-lg hover:bg-teal-500 transition duration-300"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AppLayout()(Chat);
