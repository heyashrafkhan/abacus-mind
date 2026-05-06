import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import LessonView from './pages/LessonView';
import Practice from './pages/Practice';
import ProgressPage from './pages/ProgressPage';
import ParentDashboard from './pages/ParentDashboard';
import ProfileSelector from './pages/ProfileSelector';
import { useProgress } from './context/ProgressContext';

function App() {
  const { progress } = useProgress();

  if (!progress) {
    return (
      <Routes>
        <Route path="/profile" element={<ProfileSelector />} />
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:lessonId" element={<LessonView />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/parents" element={<ParentDashboard />} />
      </Route>
      <Route path="/profile" element={<ProfileSelector />} />
    </Routes>
  );
}

export default App;
