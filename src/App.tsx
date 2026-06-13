import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import { AppProvider, useApp } from './context/AppContext';
import AnalysisPage from './pages/AnalysisPage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import StatisticsPage from './pages/StatisticsPage';
import TrainPage from './pages/TrainPage';

function AppRoutes() {
  const { profile } = useApp();
  if (!profile.onboarded) return <Onboarding />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trana" element={<TrainPage />} />
        <Route path="/analys" element={<AnalysisPage />} />
        <Route path="/historik" element={<HistoryPage />} />
        <Route path="/statistik" element={<StatisticsPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
