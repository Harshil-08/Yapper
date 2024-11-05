import React from 'react';

const MembersList = () => {
  // Sample member data for demonstration
  const members = [
    { id: 1, name: 'Alice Johnson', img: 'https://via.placeholder.com/40', status: 'online' },
    { id: 2, name: 'Bob Smith', img: 'https://via.placeholder.com/40', status: 'offline' },
    { id: 3, name: 'Cathy Brown', img: 'https://via.placeholder.com/40', status: 'online' },
    { id: 4, name: 'Daniel Green', img: 'https://via.placeholder.com/40', status: 'offline' },
  ];

  return (
    <div className="w-64 bg-white border-l-2 border-teal-300 h-full p-2 overflow-y-auto">
      <h2 className="text-xl font-semibold text-teal-700 mb-4">Members</h2>
      {members.map(member => (
        <div key={member.id} className="flex items-center p-2 rounded-lg hover:bg-teal-100 mb-2">
          <img src={member.img} alt={`${member.name} profile`} className="w-10 h-10 rounded-full mr-3" />
          <div className="flex-1">
            <p className="font-semibold">{member.name}</p>
            <p className={`text-xs ${member.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
              {member.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersList;
