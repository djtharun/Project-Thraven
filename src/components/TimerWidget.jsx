import React, { useEffect, useState } from 'react';

export default function TimerWidget() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isWorkTime, setIsWorkTime] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          setIsWorkTime((prevMode) => !prevMode);
          return (isWorkTime ? 5 : 25) * 60; // Switch durations
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorkTime]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;  

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent text-white font-mono text-lg select-none">
      <div className="mb-1 text-sm uppercase tracking-wide opacity-80">
        {isWorkTime ? 'Work Time' : 'Break Time'}
      </div>
      <div className="text-3xl font-bold">{formatTime(secondsLeft)}</div>
    </div>
  );
}