import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LiveMatches from './pages/LiveMatches';
import CarromBracket from './pages/CarromBracket';
import SequenceGroups from './pages/SequenceGroups';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Leaderboard from './pages/Leaderboard';
import Schedule from './pages/Schedule';
import Gallery from './pages/Gallery';
import History from './pages/History';
import Login from './pages/Login';
import MatchDetails from './pages/MatchDetails';
import AdminPortal from './pages/AdminPortal';
import UmpireScreen from './pages/UmpireScreen';

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/"            element={<Landing />} />
      <Route path="/dashboard"   element={<Dashboard />} />
      <Route path="/live"        element={<LiveMatches />} />
      <Route path="/carrom"      element={<CarromBracket />} />
      <Route path="/sequence"    element={<SequenceGroups />} />
      <Route path="/teams"       element={<Teams />} />
      <Route path="/players"     element={<Players />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/schedule"    element={<Schedule />} />
      <Route path="/gallery"     element={<Gallery />} />
      <Route path="/history"     element={<History />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/match/:id"   element={<MatchDetails />} />
      <Route path="/admin"       element={<AdminPortal />} />
      <Route path="/umpire/:id"  element={<UmpireScreen />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
          success: { iconTheme: { primary: '#2563EB', secondary: '#ffffff' } },
        }}
      />
    </BrowserRouter>
  );
}
