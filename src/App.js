import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainApp from './pages/Home';
import TimerWidget from './components/TimerWidget';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/widget" element={<TimerWidget />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
