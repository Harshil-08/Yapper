import { X } from "lucide-react";

const CreateGroup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Group</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <input 
          type="text" 
          placeholder="Group Name..." 
          className="mt-3 p-2 w-full border rounded-md"
        />
        <button className="mt-3 w-full bg-teal-600 text-white p-2 rounded-md">
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
