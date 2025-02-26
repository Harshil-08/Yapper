import { X } from "lucide-react";

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-3 text-gray-600">No new notifications</p>
      </div>
    </div>
  );
};

export default NotificationModal;
