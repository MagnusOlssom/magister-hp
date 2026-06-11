import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import StatisticsPage from './pages/StatisticsPage';
import TrainPage from './pages/TrainPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trana" element={<TrainPage />} />
            <Route path="/historik" element={<HistoryPage />} />
            <Route path="/statistik" element={<StatisticsPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
