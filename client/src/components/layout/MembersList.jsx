import React, { useEffect, useState } from "react";
import axios from "axios";

const MembersList = ({ chatId }) => {
  const [admin, setAdmin] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}/members`);
        const { admin, members } = response.data;
        setAdmin(admin);
        setMembers(members);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [chatId]);

  if (loading) {
    return <div className="p-4">Loading members...</div>;
  }

  return (
    <div className="w-64 h-full bg-white border-l border-teal-300 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-teal-700 mb-4">Members</h2>
      {admin && (
        <div className="flex items-center p-2 rounded-lg bg-teal-100 mb-2">
          <img
            src={admin.avatar}
            alt={`${admin.username} profile`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="font-semibold">{admin.username} (Admin)</p>
        </div>
      )}
      {members.map((member) => (
        <div
          key={member._id}
          className="flex items-center p-2 rounded-lg hover:bg-teal-100 mb-2"
        >
          <img
            src={member.avatar}
            alt={`${member.username} profile`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="font-semibold">{member.username}</p>
        </div>
      ))}
    </div>
  );
};

export default MembersList;
