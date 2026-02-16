import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/swimlanes" element={<SwimLanes />} />
            <Route path="/challenges" element={<IdeaSolutionCards />} />
            <Route path="/challenges/submit" element={<ProtectedRoute><SubmitChallenge /></ProtectedRoute>} />
            <Route path="/challenges/:id" element={<ChallengeDetail />} />
            <Route path="/challenges/:challengeId/ideas/:ideaId" element={<IdeaDetail />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

