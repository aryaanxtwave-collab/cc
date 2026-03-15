import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TeamDetail from './pages/TeamDetail';
import ExecSummary from './pages/ExecSummary';
import Feedback from './pages/Feedback';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamId" element={<TeamDetail />} />
        <Route path="/team/:teamId/exec-summary" element={<ExecSummary />} />
        <Route path="/team/:teamId/feedback" element={<Feedback />} />
      </Routes>
    </div>
  );
}
