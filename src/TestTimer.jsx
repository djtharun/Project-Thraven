import React from "react";
import ReactDOM from "react-dom/client";
import PomodoroTimer from "./components/PomodoroTimer";

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <PomodoroTimer />
    </div>
  );
}

export default App;
root.render(<App />);