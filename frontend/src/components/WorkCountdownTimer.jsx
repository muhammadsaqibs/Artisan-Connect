import { useState, useEffect } from "react";
import { Clock, Play, Pause, CheckCircle } from "lucide-react";

export default function WorkCountdownTimer({ booking, onWorkStart, onWorkComplete }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [workStarted, setWorkStarted] = useState(false);
  const [workCompleted, setWorkCompleted] = useState(false);

  useEffect(() => {
    if (!booking) return;

    // Check if work has already started
    const startTime = booking.timeline?.find(t => t.status === "started")?.timestamp;
    if (startTime) {
      setWorkStarted(true);
      const startTimeDate = new Date(startTime);
      const now = new Date();
      const elapsed = Math.floor((now - startTimeDate) / 1000);
      setTimeLeft(Math.max(0, booking.bookingDetails.duration * 3600 - elapsed));
    }

    // Check if work is completed
    if (booking.workStatus === "completed") {
      setWorkCompleted(true);
    }
  }, [booking]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setWorkCompleted(true);
            if (onWorkComplete) onWorkComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onWorkComplete]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWork = () => {
    if (!workStarted) {
      setWorkStarted(true);
      setTimeLeft(booking.bookingDetails.duration * 3600);
      if (onWorkStart) onWorkStart();
    }
    setIsRunning(true);
  };

  const handlePauseWork = () => {
    setIsRunning(false);
  };

  const handleResumeWork = () => {
    setIsRunning(true);
  };

  if (workCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">Work Completed</h3>
            <p className="text-sm text-green-700">Great job! The work has been completed successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Work Timer
        </h3>
        <div className="text-sm text-gray-600">
          Duration: {booking.bookingDetails.duration} hours
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-600">
          {isRunning ? "Work in Progress" : workStarted ? "Work Paused" : "Ready to Start"}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!workStarted ? (
          <button
            onClick={handleStartWork}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Play className="w-4 h-4" />
            Start Work
          </button>
        ) : !isRunning ? (
          <button
            onClick={handleResumeWork}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Play className="w-4 h-4" />
            Resume Work
          </button>
        ) : (
          <button
            onClick={handlePauseWork}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            <Pause className="w-4 h-4" />
            Pause Work
          </button>
        )}
      </div>

      {workStarted && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Started:</strong> {new Date(booking.timeline?.find(t => t.status === "started")?.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}






