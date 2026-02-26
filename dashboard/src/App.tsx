import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { SwimLanes } from './pages/SwimLanes';
import { ChallengeDetail } from './pages/ChallengeDetail';
import { SubmitChallenge } from './pages/SubmitChallenge';
import { IdeaDetail } from './pages/IdeaDetail';
import { IdeaSolutionCards } from './pages/IdeaSolutionCards';
import { Metrics } from './pages/Metrics';
import { Notifications } from './pages/Notifications';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { WhatsNext } from './pages/WhatsNext';
import { AdminControlPanel } from './pages/AdminControlPanel';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/swimlanes" element={<SwimLanes />} />
                <Route path="/challenges" element={<IdeaSolutionCards />} />
                <Route path="/challenges/submit" element={<SubmitChallenge />} />
                <Route path="/challenges/:id" element={<ChallengeDetail />} />
                <Route path="/challenges/:challengeId/ideas/:ideaId" element={<IdeaDetail />} />
                <Route path="/metrics" element={<Metrics />} />
                <Route path="/whats-next" element={<WhatsNext />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminControlPanel />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

