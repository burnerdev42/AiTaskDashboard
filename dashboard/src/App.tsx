import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { SwimLanes } from './pages/SwimLanes';
import { ChallengeDetail } from './pages/ChallengeDetail';
import { SubmitChallenge } from './pages/SubmitChallenge';
import { IdeaDetail } from './pages/IdeaDetail';
import { Challenges } from './pages/Challenges';
import { Metrics } from './pages/Metrics';
import { Notifications } from './pages/Notifications';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/swimlanes" element={<SwimLanes />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/submit" element={<SubmitChallenge />} />
            <Route path="/challenges/:id" element={<ChallengeDetail />} />
            <Route path="/challenges/:challengeId/ideas/:ideaId" element={<IdeaDetail />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

