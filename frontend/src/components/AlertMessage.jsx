// src/components/AlertMessage.jsx
export default function AlertMessage({ type, message, onClose }) {
  return (
    <div
      className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50
        ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-xl font-bold hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}
