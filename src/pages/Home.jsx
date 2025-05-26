import PomodoroTimer from "../components/PomodoroTimer.jsx";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">PomoTracker</h1>
        <PomodoroTimer
        />
      </div>
    </div>
  );
}
