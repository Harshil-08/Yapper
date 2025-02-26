import { X } from "lucide-react";

const SearchUser = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Search Users</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <input 
          type="text" 
          placeholder="Search users..." 
          className="mt-3 p-2 w-full border rounded-md"
        />
      </div>
    </div>
  );
};

export default SearchUser;
