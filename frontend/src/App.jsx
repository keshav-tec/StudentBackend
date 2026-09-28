import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import DoubtForm from "./components/student/DoubtForm";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import TutorProfile from "./pages/TutorProfile";
import AdminDashboard from "./pages/AdminDashboard";

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({
  children,
  allowedRole,
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // -----------------------------------------------------
  // CHECKING JWT AUTHENTICATION
  // -----------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05050b] text-white">
        Checking authentication...
      </div>
    );
  }

  // -----------------------------------------------------
  // USER NOT AUTHENTICATED
  // -----------------------------------------------------

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // -----------------------------------------------------
  // WRONG ROLE
  // -----------------------------------------------------

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {
    if (user.role === "student") {
      return (
        <Navigate
          to="/student-dashboard"
          replace
        />
      );
    }

    if (user.role === "tutor") {
      return (
        <Navigate
          to="/tutor-dashboard"
          replace
        />
      );
    }

    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin-dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

// =====================================================
// APP ROUTES
// =====================================================

function AppRoutes() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* =================================================
          STUDENT DASHBOARD
      ================================================= */}

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          TUTOR DASHBOARD
      ================================================= */}

      <Route
        path="/tutor-dashboard"
        element={
          <ProtectedRoute allowedRole="tutor">
            <TutorDashboard />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          TUTOR PROFILE / SPECIALIZATION
      ================================================= */}

      <Route
        path="/tutor-profile"
        element={
          <ProtectedRoute allowedRole="tutor">
            <TutorProfile />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          STUDENT DOUBT FORM
      ================================================= */}

      <Route
        path="/doubt-form"
        element={
          <ProtectedRoute allowedRole="student">
            <DoubtForm />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          ADMIN DASHBOARD
      ================================================= */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          OLD ROUTES — OPTIONAL COMPATIBILITY
      ================================================= */}

      <Route
        path="/dashboard/student"
        element={
          <Navigate
            to="/student-dashboard"
            replace
          />
        }
      />

      <Route
        path="/dashboard/tutor"
        element={
          <Navigate
            to="/tutor-dashboard"
            replace
          />
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <Navigate
            to="/admin-dashboard"
            replace
          />
        }
      />

      {/* =================================================
          UNKNOWN ROUTE
      ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

// =====================================================
// ROOT APP
// =====================================================

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}