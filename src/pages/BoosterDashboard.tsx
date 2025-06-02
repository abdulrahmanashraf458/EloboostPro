import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  DashboardBoosterLayout,
  DashboardBoosterHome,
  DashboardBoosterChat
} from '../components/dashboard-booster';
import DashboardBoosterOrders from '../components/dashboard-booster/DashboardBoosterOrders';
import DashboardBoosterSettings from '../components/dashboard-booster/DashboardBoosterSettings';
import DashboardBoosterAvailableOrders from '../components/dashboard-booster/DashboardBoosterAvailableOrders';
import DashboardBoosterOrderDetail from '../components/dashboard-booster/DashboardBoosterOrderDetail';
import DashboardBoosterNotifications from '../components/dashboard-booster/DashboardBoosterNotifications';

const BoosterDashboard: React.FC = () => {
  return (
    <DashboardBoosterLayout>
      <Routes>
        <Route path="/" element={<DashboardBoosterHome />} />
        <Route path="/available-orders" element={<DashboardBoosterAvailableOrders />} />
        <Route path="/orders" element={<DashboardBoosterOrders />} />
        <Route path="/orders/:orderId" element={<DashboardBoosterOrderDetail />} />
        <Route path="/notifications" element={<DashboardBoosterNotifications />} />
        <Route path="/chat" element={<DashboardBoosterChat />} />
        <Route path="/settings" element={<DashboardBoosterSettings />} />
        <Route path="/dashboard" element={<Navigate to="/booster" replace />} />
        <Route path="*" element={<Navigate to="/booster" replace />} />
      </Routes>
    </DashboardBoosterLayout>
  );
};

export default BoosterDashboard; 