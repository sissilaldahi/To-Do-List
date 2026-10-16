import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import WeeklyViewPage from './pages/WeeklyViewPage';
import MonthlyViewPage from './pages/MonthlyViewPage';
import YearlyViewPage from './pages/YearlyViewPage';
import ReportsPage from './pages/ReportsPage';
import Login from './pages/Login';
import Register from './pages/Register'; 
import SmartSchedulerPage from './pages/SmartSchedulerPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/weekly" element={<WeeklyViewPage />} />
                    <Route path="/monthly" element={<MonthlyViewPage />} />
                    <Route path="/yearly" element={<YearlyViewPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/scheduler" element={<SmartSchedulerPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;