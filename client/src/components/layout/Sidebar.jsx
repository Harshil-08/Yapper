import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useChat } from "../../contexts/ChatContext.jsx"
import { useUser } from "../../contexts/UserContext.jsx"
import { X } from "lucide-react"

const Sidebar = ({ closeSidebar }) => {
  const [chats, setChats] = useState([])
  const { setSelectedChat } = useChat()
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("/api/chats/user-chats", { withCredentials: true })
        if (response.data.success) {
          setChats(response.data.chats)
        }
      } catch (error) {
        console.log("Failed to fetch chats:", error.message)
      }
    }
    fetchChats()
  }, [])

  const handleChatClick = (chat) => {
    setSelectedChat(chat)
    navigate(`/chat/${chat.name}`)
    closeSidebar && closeSidebar()
  }

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", { withCredentials: true })
      localStorage.removeItem("selectedChat")
      localStorage.removeItem("user")
      navigate("/")
    } catch (error) {
      console.log("Logout failed:", error.message)
    }
  }

  return (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-800 text-teal-900 dark:text-white border-r border-teal-300 dark:border-gray-700">
      <div className="lg:hidden flex justify-end p-2">
        <button
          onClick={closeSidebar}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close sidebar"
        >
          <X size={20} className="text-teal-900 dark:text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="font-semibold text-teal-700 dark:text-teal-300 text-lg mb-4">Chats</h2>
        {chats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-teal-100 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center">
                <img
                  src={chat.avatar?.url}
                  alt={`${chat.name} profile`}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-semibold dark:text-white">{chat.name}</span>
              </div>
              {chat.unread > 0 && (
                <span className="text-xs font-semibold bg-teal-500 text-white px-2 py-1 rounded-full">
                  {chat.unread}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-teal-600 dark:bg-black text-white bottom-0">
        <div className="flex items-center p-3 bg-teal-700 dark:bg-gray-800 rounded-lg mb-2 shadow">
          <img
            src={user?.avatar?.url}
            alt={user?.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{user?.username}</p>
          </div>
        </div>

        <button
          className="w-full py-2 text-sm font-semibold bg-teal-500 dark:bg-gray-700 rounded-lg hover:bg-teal-400 dark:hover:bg-gray-600 transition duration-150"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar;

