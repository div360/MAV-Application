import React, { useState } from "react";
import { Modal } from "antd";

// Define the ToDoModalProps interface. Assuming your to-do items are strings.
interface ToDoModalProps {
  visible: boolean; // Control modal visibility
  onClose: () => void;
  toDos: string[];
  addToDo: (newToDo: string) => void;
  deleteToDo: (index: number) => void;
}

const ToDoModal: React.FC<ToDoModalProps> = ({
  visible,
  onClose,
  toDos,
  addToDo,
  deleteToDo,
}) => {
  const [newToDoInput, setNewToDoInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewToDoInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newToDoInput.trim()) {
      addToDo(newToDoInput);
      setNewToDoInput(""); // Clear input field after adding
    }
  };

  return (
    <Modal
      title="To-Do List"
      visible={visible}
      onCancel={onClose}
      footer={null} // Remove Ant Design's default footer if needed
      className="tailwind-modal" // Add a class for Tailwind styling
    >
      {/* To-Do List Display (Tailwind classes) */}
      <ul className="p-4">
        {toDos.map((todo, index) => (
          <li key={index} className="flex items-center gap-2 mb-2">
            {todo}{" "}
            <button
              onClick={() => deleteToDo(index)}
              className="bg-red-400 text-white px-2 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* New To-do Form (Tailwind classes) */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={newToDoInput}
          onChange={handleInputChange}
          placeholder="Add a new to-do..."
          className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          Add
        </button>
      </form>
    </Modal>
  );
};

export default ToDoModal;
