// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute'; 
import './i18n/i18n';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedLayout from './components/ProtectedLayout';
import About from './pages/About';
import AdminCampaigns from './pages/AdminCampaigns';
import CampaignForm from './components/CampaignsForm';
import AdminDonations from './pages/AdminDonations';
import AdminWithdrawals from './pages/AdminWithdrawls';
import AdminReports from './pages/AdminReports';
import CampaignDetailPage from './pages/CampaignDetail';

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <ProtectedLayout isAdmin="true">
              <AdminDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Route Campaign */}
        <Route path="/admin-campaigns" element={
          <ProtectedRoute><ProtectedLayout isAdmin="true"><AdminCampaigns /></ProtectedLayout></ProtectedRoute>
        } />
        <Route path="/admin-campaigns/create" element={
          <ProtectedRoute><ProtectedLayout isAdmin="true"><CampaignForm /></ProtectedLayout></ProtectedRoute>
        } />
        <Route path="/campaigns/:id" element={
          <ProtectedRoute><ProtectedLayout><CampaignDetailPage /></ProtectedLayout></ProtectedRoute>
        } />


        {/* Route Donation */}
        <Route path="/admin-donations" element={
          <ProtectedRoute><ProtectedLayout isAdmin="true"><AdminDonations /></ProtectedLayout></ProtectedRoute>
        } />

        {/* Route Withdraws */}
        <Route path="/admin-withdrawals" element={
          <ProtectedRoute>
            <ProtectedLayout isAdmin="true">
              <AdminWithdrawals />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Route Report */}
        <Route path="/admin-reports" element={
          <ProtectedRoute><ProtectedLayout isAdmin="true"><AdminReports /></ProtectedLayout></ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
