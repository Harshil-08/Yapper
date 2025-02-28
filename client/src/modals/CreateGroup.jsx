import { useState, useEffect, useCallback } from "react"
import { X, UserPlus, Check } from "lucide-react"
import axios from "axios"

const CreateGroup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("create")
  const [groupName, setGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [groupCode, setGroupCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const fetchUsers = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await axios.get(`/api/user/search?name=${searchQuery}`, {
        withCredentials: true,
      })

      setSearchResults(response.data.users || [])
    } catch (error) {
      setMessage("Failed to search users")
    }
  }, [searchQuery])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers()
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery, fetchUsers])

  const handleMemberSelect = (memberId) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const handleCreateGroup = async () => {
    if (!groupName || selectedMembers.length < 2) {
      setMessage("Group chat must have at least 3 members, including you.")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        "/api/chats/create-group",
        {
          name: groupName,
          members: selectedMembers,
        },
        { withCredentials: true },
      )

      setMessage(response.data.message)
      onClose()
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create group")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGroup = async () => {
    if (!groupCode) {
      setMessage("Please enter a valid group code.")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`/api/chats/join?joinLink=${groupCode}`, { withCredentials: true })

      setMessage(response.data.message)
      onClose()
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to join group")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {activeTab === "create" ? "Create Group" : "Join Group"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-3 flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`w-1/2 py-2 ${
              activeTab === "create"
                ? "border-b-2 border-teal-600 font-semibold text-teal-600 dark:text-teal-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create Group
          </button>
          <button
            className={`w-1/2 py-2 ${
              activeTab === "join"
                ? "border-b-2 border-teal-600 font-semibold text-teal-600 dark:text-teal-400"
                : "text-gray-500 dark:text-gray-400"
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
              className="mt-3 p-2 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            />

            {/* Search for Members */}
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-3 p-2 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            />

            {/* Search Results */}
            <div className="mt-3 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 p-2 rounded-md">
              {searchResults.length > 0 ? (
                searchResults.map((u) => (
                  <div
                    key={u._id}
                    className="flex items-center justify-between p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <img src={u.avatar.url || "/placeholder.svg"} alt={u.username} className="w-6 h-6 rounded-full" />
                      <span className="text-gray-900 dark:text-white">{u.username}</span>
                    </div>
                    <button
                      onClick={() => handleMemberSelect(u._id)}
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                    >
                      {selectedMembers.includes(u._id) ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <UserPlus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No users found.</p>
              )}
            </div>

            {/* Error / Success Message */}
            {message && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>}

            {/* Create Button */}
            <button
              className="mt-3 w-full bg-teal-600 text-white p-2 rounded-md disabled:opacity-50 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
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
              className="mt-3 p-2 w-full border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            />

            {/* Error / Success Message */}
            {message && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{message}</p>}

            {/* Join Button */}
            <button
              className="mt-3 w-full bg-teal-600 text-white p-2 rounded-md disabled:opacity-50 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              onClick={handleJoinGroup}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CreateGroup

