import React from 'react';

const Sidebar = () => {
  const chats = [
    { id: 1, name: 'Group Chat', img: 'https://via.placeholder.com/40', unread: 3 },
    { id: 2, name: 'John Doe', img: 'https://via.placeholder.com/40', unread: 0 },
    { id: 3, name: 'Jane Smith', img: 'https://via.placeholder.com/40', unread: 5 },
    // Add more chat data as needed
  ];

  return (
    <div className="flex flex-col h-full w-64 border-r-2 border-teal-300 bg-white text-teal-900">
      {/* Chat List with Scroll */}
      <div className="flex-1 overflow-y-auto p-2">
        <span className="font-semibold text-teal-700 text-lg mb-4 block">Chats</span>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center justify-between p-2 mb-2 rounded-lg cursor-pointer hover:bg-teal-100"
          >
            <div className="flex items-center">
              <img
                src={chat.img}
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

      {/* Profile & Logout Section */}
      <div className="p-4 bg-teal-600 text-white sticky bottom-0">
        {/* Profile */}
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

        {/* Logout Button */}
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
