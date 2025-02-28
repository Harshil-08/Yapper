import { useState, useEffect, useCallback } from "react";
import { X, MessageSquare } from "lucide-react";
import axios from "axios";
import { useChat } from "../contexts/ChatContext.jsx";

const SearchUser = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { setSelectedChat } = useChat();

  const fetchUsers = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/search?name=${searchQuery}`, {
        withCredentials: true,
      });
      setSearchResults(response.data.users || []);
    } catch (error) {
      setMessage("Failed to search users");
    }
    setLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchUsers]);

  const handleStartChat = async (userId) => {
    try {
      const response = await axios.post(
        "/api/user/newChat",
        { userId },
        { withCredentials: true }
      );
      if (response.data.success) {
        setSelectedChat(response.data.chat);
        onClose();
      } else {
        setMessage("Failed to start chat");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to start chat");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Search Users
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-3 p-2 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
        />

        {loading && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Loading...</p>}
        {message && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>}

        <div className="mt-3 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 p-2 rounded-md">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar?.url || "/placeholder.svg"}
                    alt={user.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-gray-900 dark:text-white">{user.username}</span>
                </div>
                <button
                  onClick={() => handleStartChat(user._id)}
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                >
                  <MessageSquare className="w-5 h-5 "/>
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
