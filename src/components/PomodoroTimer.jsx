import ding from '../assets/ding.mp3';
import { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function PomodoroTimer({ workMinutes, breakMinutes, cycles }) {
  const [localWorkMinutes, setLocalWorkMinutes] = useState(workMinutes);
  const [localBreakMinutes, setLocalBreakMinutes] = useState(breakMinutes);
  const [localCycles, setLocalCycles] = useState(cycles);

  const [secondsLeft, setSecondsLeft] = useState(localWorkMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [task, setTask] = useState('');
  const [logs, setLogs] = useState([]);

  const chartData = logs.reduce((acc, log) => {
    acc[log.task] = (acc[log.task] || 0) + log.duration;
    return acc;
  }, {});
  
  const barData = {
    labels: Object.keys(chartData),
    datasets: [
      {
        label: 'Minutes Spent',
        data: Object.values(chartData),
        backgroundColor: '#6366F1',
      },
    ],
  };  

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("pomodoroLogs") || "[]");
    setLogs(data);
  }, [secondsLeft === 0]); // updates every time a session finishes


  const audioRef = useRef(new Audio(ding));
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft((isWorkTime ? localWorkMinutes : localBreakMinutes) * 60);
    }
  }, [localWorkMinutes, localBreakMinutes, localCycles, isRunning, isWorkTime]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 0) {
          clearInterval(intervalRef.current);
          audioRef.current.play().catch(console.warn);

          // 📝 Save session if it was a work session
          if (isWorkTime && task.trim()) {
            const session = {
              task,
              duration: localWorkMinutes,
              date: new Date().toISOString(),
            };
            const prevLogs = JSON.parse(localStorage.getItem("pomodoroLogs") || "[]");
            localStorage.setItem("pomodoroLogs", JSON.stringify([...prevLogs, session]));
          }

          const nextIsWork = !isWorkTime;
          const isLastCycle = nextIsWork && currentCycle === localCycles;

          if (isLastCycle) {
            setIsRunning(false);
            return 0;
          }

          setIsWorkTime(nextIsWork);
          if (nextIsWork) setCurrentCycle((c) => c + 1);
          const newTime = (nextIsWork ? localWorkMinutes : localBreakMinutes) * 60;
          return newTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isWorkTime, currentCycle, localWorkMinutes, localBreakMinutes, localCycles]);

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkTime(true);
    setCurrentCycle(1);
    setSecondsLeft(localWorkMinutes * 60);
    clearInterval(intervalRef.current);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const seconds = (secondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-2xl max-w-xs mx-auto text-center">
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Work Minutes:</label>
          <input
            type="number"
            min={1}
            value={localWorkMinutes}
            onChange={(e) => setLocalWorkMinutes(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
            disabled={isRunning}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Break Minutes:</label>
          <input
            type="number"
            min={1}
            value={localBreakMinutes}
            onChange={(e) => setLocalBreakMinutes(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
            disabled={isRunning}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cycles:</label>
          <input
            type="number"
            min={1}
            value={localCycles}
            onChange={(e) => setLocalCycles(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
            disabled={isRunning}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Current Task</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Current Task:</label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
          placeholder="e.g. Write report"
          disabled={isRunning}
        />
      </div>

      <h2 className="text-lg font-semibold mb-2">
        {isWorkTime ? 'Work Session' : 'Break Time'}
      </h2>
      <p className="text-4xl font-mono text-indigo-600 mb-4">{formatTime()}</p>

      <div className="space-x-2">
        <button
          onClick={toggleTimer}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>

      <p className="text-xs mt-4 text-gray-500">
        Cycle {currentCycle} of {localCycles}
      </p>

      <div className="mt-6 text-left">
        <h3 className="text-md font-semibold mb-2">Session Log</h3>
        <ul className="space-y-1 text-sm text-gray-700 max-h-40 overflow-auto">
          {logs.map((log, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded">
              ✅ {log.task} — {log.duration} min @ {new Date(log.date).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Time Spent per Task</h3>
        <Bar data={barData} />
      </div>

    </div>
  );
}
// This code is a React component that implements a Pomodoro timer with customizable work and break durations, as well as the number of cycles.
// It uses the useState and useEffect hooks to manage state and side effects, such as starting and stopping the timer.
// The timer plays a sound when the time is up, and it updates the display to show the remaining time in MM:SS format.
// The component also includes input fields for the user to set the work and break durations and the number of cycles.
// The timer can be started, paused, and reset, and it displays the current cycle number.
// The component is styled using Tailwind CSS classes for a clean and modern look.
// The timer is designed to be user-friendly, with clear labels and buttons for interaction.
// The component is exported as the default export of the module, making it available for use in other parts of the application.
// The code also includes a reference to an audio file (ding.mp3) that is played when the timer reaches zero.
// The audio file is imported at the top of the file and used in the useEffect hook that handles the timer logic.
// The component is designed to be reusable, allowing for easy integration into different parts of a React application.
// The component is styled using Tailwind CSS classes for a clean and modern look.
// The timer is designed to be user-friendly, with clear labels and buttons for interaction.
// The component is exported as the default export of the module, making it available for use in other parts of the application.