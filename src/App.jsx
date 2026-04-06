import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AlgorithmsPage from './pages/AlgorithmsPage.jsx';
import VisualizerPage from './pages/VisualizerPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/algoritmos" element={<AlgorithmsPage />} />
      <Route path="/visualizar/:algorithm" element={<VisualizerPage />} />
      <Route path="/visualizar" element={<Navigate to="/visualizar/BFS" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
