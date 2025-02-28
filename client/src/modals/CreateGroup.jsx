import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";

const CreateGroup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("create"); 
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useUser();

  // Debounced Search Function
  const fetchUsers = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`/api/users/search?name=${searchQuery}`, {
        withCredentials: true,
      });

      setSearchResults(response.data.users || []);
    } catch (error) {
      setMessage("Failed to search users");
    }
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce time (300ms)

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchUsers]);

  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length < 2) {
      setMessage("Group chat must have at least 3 members, including you.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/chats/create-group",
        {
          name: groupName,
          members: selectedMembers,
        },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode) {
      setMessage("Please enter a valid group code.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `/api/chats/join?joinLink=${groupCode}`,
        { withCredentials: true }
      );

      setMessage(response.data.message);
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to join group");
    } finally {
      setLoading(false);
    }
  };
	if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeTab === "create" ? "Create Group" : "Join Group"}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-3 flex border-b">
          <button
            className={`w-1/2 py-2 ${
              activeTab === "create" ? "border-b-2 border-teal-600 font-semibold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create Group
          </button>
          <button
            className={`w-1/2 py-2 ${
              activeTab === "join" ? "border-b-2 border-teal-600 font-semibold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("join")}
          >
            Join Group
          </button>
        </div>

        {activeTab === "create" ? (
          <>
            {/* Group Name Input */}
            <input
              type="text"
              placeholder="Group Name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-3 p-2 w-full border rounded-md"
            />

            {/* Search for Members */}
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-3 p-2 w-full border rounded-md"
            />

            {/* Search Results */}
            <div className="mt-3 max-h-40 overflow-y-auto border p-2 rounded-md">
              {searchResults.length > 0 ? (
                searchResults.map((u) => (
                  <label key={u._id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(u._id)}
                      onChange={() => handleMemberSelect(u._id)}
                      className="form-checkbox text-teal-600"
                    />
                    <img src={u.avatar} alt={u.username} className="w-6 h-6 rounded-full" />
                    <span>{u.username}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">No users found.</p>
              )}
            </div>

            {/* Error / Success Message */}
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}

            {/* Create Button */}
            <button
              className="mt-3 w-full bg-teal-600 text-white p-2 rounded-md disabled:opacity-50"
              onClick={handleCreateGroup}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </>
        ) : (
          <>
            {/* Group Code Input */}
            <input
              type="text"
              placeholder="Enter Group Code..."
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              className="mt-3 p-2 w-full border rounded-md"
            />

            {/* Error / Success Message */}
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}

            {/* Join Button */}
            <button
              className="mt-3 w-full bg-teal-600 text-white p-2 rounded-md disabled:opacity-50"
              onClick={handleJoinGroup}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
