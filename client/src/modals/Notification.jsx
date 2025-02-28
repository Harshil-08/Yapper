import { X } from "lucide-react"

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-300">No new notifications</p>
      </div>
    </div>
  )
}

export default NotificationModal

