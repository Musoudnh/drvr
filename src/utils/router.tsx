import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Login from '../pages/Auth/Login';
import SignIn from '../pages/Auth/SignIn';
import Setup from '../pages/Auth/Setup';
import CompanyDashboard from '../pages/Dashboard/CompanyDashboard';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import Forecasting from '../pages/Forecasting/Forecasting';
import ScenarioPlanning from '../pages/Forecasting/ScenarioPlanning';
import VarianceInsights from '../pages/Forecasting/VarianceInsights';
import MonthsViewDemo from '../pages/Forecasting/MonthsViewDemo';
import Reports from '../pages/Reports/Reports';
import ProfitLoss from '../pages/Reports/ProfitLoss';
import BalanceSheet from '../pages/Reports/BalanceSheet';
import CashFlow from '../pages/Reports/CashFlow';
import FinancialSummary from '../pages/Reports/FinancialSummary';
import ReportsExport from '../pages/Reports/ReportsExport';
import Analytics from '../pages/Analytics/Analytics';
import PredictiveAnalytics from '../pages/Analytics/PredictiveAnalytics';
import Insights from '../pages/Insights/Insights';
import Alerts from '../pages/Alerts/Alerts';
import Benchmarks from '../pages/Benchmarks/Benchmarks';
import Integrations from '../pages/Integrations/Integrations';
import DataIntegration from '../pages/Integrations/DataIntegration';
import TeamManagement from '../pages/Team/TeamManagement';
import AccountProfile from '../pages/Settings/AccountProfile';
import BillingSettings from '../pages/Settings/BillingSettings';
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminSettings from '../pages/Admin/AdminSettings';
import Security from '../pages/Admin/Security';
import AuditLog from '../pages/Admin/AuditLog';
import ReferralProgram from '../pages/Referrals/ReferralProgram';
import ExpertSelection from '../pages/Expert/ExpertSelection';
import TaxDocuments from '../pages/Tax/TaxDocuments';
import WorkflowManagement from '../pages/Collaboration/WorkflowManagement';
import AuditTrailPage from '../pages/Compliance/AuditTrail';
import TasksProjects from '../pages/Tasks/TasksProjects';
import RunwayPlanning from '../pages/Runway/RunwayPlanning';
import RevenueRunway from '../pages/Runway/RevenueRunway';
import OpExRunway from '../pages/Runway/OpExRunway';
import HiringRunway from '../pages/Runway/HiringRunway';
import RoadMap from '../pages/RoadMap/RoadMap';
import Approvals from '../pages/RoadMap/Approvals';
import Sandbox from '../pages/Financials/Sandbox';
import ChatLayout from '../pages/Chat/ChatLayout';
import ChatMain from '../pages/Chat/ChatMain';
import ChatSettings from '../pages/Chat/ChatSettings';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/setup',
    element: <Setup />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <CompanyDashboard />,
      },
      {
        path: 'forecasting',
        element: <Forecasting />,
      },
      {
        path: 'forecasting/scenario-planning',
        element: <ScenarioPlanning />,
      },
      {
        path: 'forecasting/variance',
        element: <VarianceInsights />,
      },
      {
        path: 'forecasting/months-view',
        element: <MonthsViewDemo />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'reports/profit-loss',
        element: <ProfitLoss />,
      },
      {
        path: 'reports/balance-sheet',
        element: <BalanceSheet />,
      },
      {
        path: 'reports/cash-flow',
        element: <CashFlow />,
      },
      {
        path: 'reports/financial-summary',
        element: <FinancialSummary />,
      },
      {
        path: 'reports/export',
        element: <ReportsExport />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'analytics/predictive',
        element: <PredictiveAnalytics />,
      },
      {
        path: 'insights',
        element: <Insights />,
      },
      {
        path: 'alerts',
        element: <Alerts />,
      },
      {
        path: 'benchmarks',
        element: <Benchmarks />,
      },
      {
        path: 'integrations',
        element: <Integrations />,
      },
      {
        path: 'integrations/data',
        element: <DataIntegration />,
      },
      {
        path: 'team',
        element: <TeamManagement />,
      },
      {
        path: 'referrals',
        element: <ReferralProgram />,
      },
      {
        path: 'expert',
        element: <ExpertSelection />,
      },
      {
        path: 'tax',
        element: <TaxDocuments />,
      },
      {
        path: 'collaboration',
        element: <WorkflowManagement />,
      },
      {
        path: 'compliance/audit',
        element: <AuditTrailPage />,
      },
      {
        path: 'tasks',
        element: <TasksProjects />,
      },
      {
        path: 'runway',
        element: <RunwayPlanning />,
      },
      {
        path: 'runway/revenue',
        element: <RevenueRunway />,
      },
      {
        path: 'runway/opex',
        element: <OpExRunway />,
      },
      {
        path: 'runway/hiring',
        element: <HiringRunway />,
      },
      {
        path: 'roadmap',
        element: <RoadMap />,
      },
      {
        path: 'roadmap/approvals',
        element: <Approvals />,
      },
      {
        path: 'sandbox',
        element: <Sandbox />,
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: 'profile',
            element: <AccountProfile />,
          },
          {
            path: 'billing',
            element: <BillingSettings />,
          },
          {
            path: 'settings',
            element: <AdminSettings />,
          },
          {
            path: 'security',
            element: <Security />,
          },
          {
            path: 'audit',
            element: <AuditLog />,
          },
        ],
      },
      {
        path: 'chat',
        element: <ChatLayout />,
        children: [
          {
            index: true,
            element: <ChatMain />,
          },
          {
            path: 'settings',
            element: <ChatSettings />,
          },
        ],
      },
    ],
  },
]);
