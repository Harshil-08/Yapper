import { useEffect, useState } from "react"
import axios from "axios"
import { X } from "lucide-react"
import { useChatSocket } from "../../contexts/ChatSocketContext"

const StatusDot = ({ online }) => (
  <span
    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
      online ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-500"
    }`}
    title={online ? "Online" : "Offline"}
    aria-hidden
  />
)

const MembersList = ({ chatId, closeMembers }) => {
  const [admin, setAdmin] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const { isUserOnline } = useChatSocket()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}/members`)
        const { admin, members } = response.data
        setAdmin(admin)
        setMembers(members)
      } catch (error) {
        console.error("Failed to fetch members:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [chatId])

  if (loading) {
    return (
      <div className="w-64 h-full bg-white dark:bg-gray-800 border-l border-teal-300 dark:border-gray-700 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-300">Members</h2>
          <button
            onClick={closeMembers}
            className="lg:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close members"
          >
            <X size={20} className="text-teal-900 dark:text-white" />
          </button>
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 dark:text-gray-400">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-l border-teal-300 dark:border-gray-700 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-300">Members</h2>
        <button
          onClick={closeMembers}
          className="lg:hidden p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close members"
        >
          <X size={20} className="text-teal-900 dark:text-white" />
        </button>
      </div>

      {admin && (
        <div className="flex items-center p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-gray-700 mb-2">
          <div className="relative shrink-0 mr-3">
            <img
              src={admin.avatar}
              alt={`${admin.username} profile`}
              className="w-10 h-10 rounded-full"
            />
            <StatusDot online={isUserOnline(admin._id)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-teal-900 dark:text-white">{admin.name} (Admin)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isUserOnline(admin._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      )}

      {members.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No other members</p>
      ) : (
        members.map((member) => (
          <div
            key={member._id}
            className="flex items-center p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-gray-700 mb-2"
          >
            <div className="relative shrink-0 mr-3">
              <img
                src={member.avatar}
                alt={`${member.username} profile`}
                className="w-10 h-10 rounded-full"
              />
              <StatusDot online={isUserOnline(member._id)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-teal-900 dark:text-white truncate">{member.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isUserOnline(member._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MembersList;

