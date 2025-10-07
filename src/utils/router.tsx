import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import AdminLayout from '../pages/Admin/AdminLayout';
import ChatLayout from '../pages/Chat/ChatLayout';
import ChatMain from '../pages/Chat/ChatMain';
import Login from '../pages/Auth/Login';
import Setup from '../pages/Auth/Setup';
import CompanyDashboard from '../pages/Dashboard/CompanyDashboard';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import FinancialSummary from '../pages/Reports/FinancialSummary';
import CashFlow from '../pages/Reports/CashFlow';
import Analytics from '../pages/Analytics/Analytics';
import AccountProfile from '../pages/Settings/AccountProfile';
import TeamManagement from '../pages/Team/TeamManagement';
import BillingSettings from '../pages/Settings/BillingSettings';
import Integrations from '../pages/Integrations/Integrations';
import Security from '../pages/Admin/Security';
import AuditLog from '../pages/Admin/AuditLog';
import AdminSettings from '../pages/Admin/AdminSettings';
import Forecasting from '../pages/Forecasting/Forecasting';
import MonthsViewDemo from '../pages/Forecasting/MonthsViewDemo';
import Benchmarks from '../pages/Benchmarks/Benchmarks';
import TaxDocuments from '../pages/Tax/TaxDocuments';
import Alerts from '../pages/Alerts/Alerts';
import BalanceSheet from '../pages/Reports/BalanceSheet';
import ProfitLoss from '../pages/Reports/ProfitLoss';
import ChatInterface from '../components/Chat/ChatInterface';
import ChatSettings from '../pages/Chat/ChatSettings';
import ExpertSelection from '../pages/Expert/ExpertSelection';
import ReferralProgram from '../pages/Referrals/ReferralProgram';
import Insights from '../pages/Insights/Insights';
import ScenarioPlanning from '../pages/ScenarioPlanning/ScenarioPlanning';
import RunwayPlanning from '../pages/Runway/RunwayPlanning';
import RevenueRunway from '../pages/Runway/RevenueRunway';
import OpExRunway from '../pages/Runway/OpExRunway';
import HiringRunway from '../pages/Runway/HiringRunway';
import VarianceInsights from '../pages/Forecasting/VarianceInsights';
import DataIntegration from '../pages/Integrations/DataIntegration';
import WorkflowManagement from '../pages/Collaboration/WorkflowManagement';
import PredictiveAnalytics from '../pages/Analytics/PredictiveAnalytics';
import AuditTrail from '../pages/Compliance/AuditTrail';
import TasksProjects from '../pages/Tasks/TasksProjects';
import RoadMap from '../pages/RoadMap/RoadMap';
import Approvals from '../pages/RoadMap/Approvals';
import { Database, GitBranch, Brain } from 'lucide-react';
import SignIn from '../pages/Auth/SignIn';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout title={title}>
      {children}
    </Layout>
  );
};

// Public Route Component (redirects if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Placeholder components for other pages
const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-[#101010] mb-4">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute title="Dashboard">
        <CompanyDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    )
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    )
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute title="Chat">
        <ChatMain />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute title="Admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/security" replace />
      },
      {
        path: "security",
        element: <Security />
      },
      {
        path: "audit",
        element: <AuditLog />
      },
      {
        path: "settings",
        element: <AdminSettings />
      },
      {
        path: "billing",
        element: <BillingSettings />
      },
      {
        path: "integrations",
        element: <Integrations />
      },
      {
        path: "team",
        element: <TeamManagement />
      },
      {
        path: "profile",
        element: <AccountProfile />
      }
    ]
  },
  {
    path: "/reports",
    element: <Navigate to="/reports/financial" replace />
  },
  {
    path: "/reports/financial",
    element: (
      <ProtectedRoute title="Financial Summary">
        <FinancialSummary />
      </ProtectedRoute>
    )
  },
  {
    path: "/reports/cashflow",
    element: (
      <ProtectedRoute title="Cash Flow">
        <CashFlow />
      </ProtectedRoute>
    )
  },
  {
    path: "/reports/balance",
    element: (
      <ProtectedRoute title="Balance Sheet">
        <BalanceSheet />
      </ProtectedRoute>
    )
  },
  {
    path: "/reports/profit-loss",
    element: (
      <ProtectedRoute title="Profit & Loss">
        <ProfitLoss />
      </ProtectedRoute>
    )
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute title="Analysis">
        <Analytics />
      </ProtectedRoute>
    )
  },
  {
    path: "/financials",
    element: <Navigate to="/forecasting" replace />
  },
  {
    path: "/forecasting",
    element: (
      <ProtectedRoute title="Forecasting">
        <Forecasting />
      </ProtectedRoute>
    )
  },
  {
    path: "/forecasting/months-view",
    element: (
      <ProtectedRoute title="Months View - Financial Forecasting">
        <MonthsViewDemo />
      </ProtectedRoute>
    )
  },
  {
    path: "/runway",
    element: (
      <ProtectedRoute title="Scenario Planner">
        <RunwayPlanning />
      </ProtectedRoute>
    )
  },
  {
    path: "/runway/revenue",
    element: (
      <ProtectedRoute title="Revenue Scenarios">
        <RevenueRunway />
      </ProtectedRoute>
    )
  },
  {
    path: "/runway/opex",
    element: (
      <ProtectedRoute title="OpEx Scenarios">
        <OpExRunway />
      </ProtectedRoute>
    )
  },
  {
    path: "/runway/hiring",
    element: (
      <ProtectedRoute title="Hiring Scenarios">
        <HiringRunway />
      </ProtectedRoute>
    )
  },
  {
    path: "/scenario-planning",
    element: (
      <ProtectedRoute title="Scenario Planning">
        <PlaceholderPage title="Scenario Planning" description="Model different business scenarios and compare outcomes" />
      </ProtectedRoute>
    )
  },
  {
    path: "/forecasting/variance-insights",
    element: (
      <ProtectedRoute title="Variance & Insights">
        <VarianceInsights />
      </ProtectedRoute>
    )
  },
  {
    path: "/insights",
    element: (
      <ProtectedRoute title="Business Insights">
        <Insights />
      </ProtectedRoute>
    )
  },
  {
    path: "/benchmarks",
    element: (
      <ProtectedRoute title="Benchmarks">
        <Benchmarks />
      </ProtectedRoute>
    )
  },
  {
    path: "/tax",
    element: (
      <ProtectedRoute title="Tax Documents">
        <TaxDocuments />
      </ProtectedRoute>
    )
  },
  {
    path: "/alerts",
    element: (
      <ProtectedRoute title="Alerts">
        <Alerts />
      </ProtectedRoute>
    )
  },
  {
    path: "/expert",
    element: (
      <ProtectedRoute title="Talk to Expert">
        <ExpertSelection />
      </ProtectedRoute>
    )
  },
  {
    path: "/referrals",
    element: (
      <ProtectedRoute title="Referrals">
        <ReferralProgram />
      </ProtectedRoute>
    )
  },
  {
    path: "/team",
    element: <Navigate to="/team/members" replace />
  },
  {
    path: "/team/members",
    element: (
      <ProtectedRoute title="Team Members">
        <TeamManagement />
      </ProtectedRoute>
    )
  },
  {
    path: "/team/accounting-firms",
    element: (
      <ProtectedRoute title="Add Accounting Firms">
        <PlaceholderPage title="Add Accounting Firms" description="Manage your accounting firm partnerships" />
      </ProtectedRoute>
    )
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute title="Tasks & Projects">
        <TasksProjects />
      </ProtectedRoute>
    )
  },
  {
    path: "/roadmap",
    element: (
      <ProtectedRoute title="Road Map">
        <RoadMap />
      </ProtectedRoute>
    )
  },
  {
    path: "/roadmap/approvals",
    element: (
      <ProtectedRoute title="Project Approvals">
        <Approvals />
      </ProtectedRoute>
    )
  }
]);