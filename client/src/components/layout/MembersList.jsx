import { useEffect, useState } from "react"
import axios from "axios"
import { X } from "lucide-react"

const MembersList = ({ chatId, closeMembers }) => {
  const [admin, setAdmin] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

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
          <img
            src={admin.avatar}
            alt={`${admin.username} profile`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="font-semibold text-teal-900 dark:text-white">{admin.username} (Admin)</p>
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
            <img
              src={member.avatar}
              alt={`${member.username} profile`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <p className="font-semibold text-teal-900 dark:text-white">{member.username}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default MembersList

