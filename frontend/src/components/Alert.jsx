import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const Alert = ({ type = "info", message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          text: "text-green-800",
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-800",
          icon: <XCircle className="w-5 h-5 text-red-400" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-800",
          icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: <Info className="w-5 h-5 text-blue-400" />,
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bg} border ${styles.text} rounded-lg shadow-lg p-4 animate-slide-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex ${styles.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-50 focus:ring-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500`}
            >
              <span className="sr-only">Close</span>
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;


