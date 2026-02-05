import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/assets/AssetList';
import WorkOrderList from './pages/work-orders/WorkOrderList';
import WorkOrderDetail from './pages/work-orders/WorkOrderDetail';
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './pages/LandingPage';
import PreventiveList from './pages/PreventiveList';
import PreventiveCalendar from './pages/PreventiveCalendar';
import InventoryList from './pages/inventory/InventoryList';
import Suppliers from './pages/inventory/Suppliers';
import OxygenDashboard from './pages/oxygen/OxygenDashboard';
import UtilityTracker from './pages/utilities/UtilityTracker';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Requisitions from './pages/Requisitions';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/assets" element={<AssetList />} />
                    <Route path="/work-orders" element={<WorkOrderList />} />
                    <Route path="/work-orders/:id" element={<WorkOrderDetail />} />

                    {/* Placeholders for Phase 2/3 */}
                    <Route path="/preventive" element={<PreventiveList />} />
                    <Route path="/preventive-calendar" element={<PreventiveCalendar />} />
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/oxygen" element={<OxygenDashboard />} />
                    <Route path="/utilities" element={<UtilityTracker />} />

                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/requisitions" element={<Requisitions />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
