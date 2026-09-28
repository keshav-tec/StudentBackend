import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getMeRequest,
  loginRequest,
  logoutRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // True while checking whether a JWT already exists
  const [loading, setLoading] = useState(true);

  // =====================================================
  // RESTORE LOGIN FROM JWT
  // =====================================================

  useEffect(() => {
    let mounted = true;

    async function restoreAuth() {
      try {
        const token = localStorage.getItem("token");

        // No JWT means user is not logged in
        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // Ask backend to verify the JWT
        const data = await getMeRequest();

        if (!mounted) return;

        if (data?.user) {
          setUser(data.user);
        } else {
          // Token may be invalid/expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        // Invalid/expired JWT
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    restoreAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (credentials) => {
    const data = await loginRequest(credentials);

    if (!data?.user || !data?.token) {
      throw new Error(data?.message || "Login failed");
    }

    // Store JWT returned by backend
    localStorage.setItem("token", data.token);

    // Optional: store user information for quick access
    localStorage.setItem("user", JSON.stringify(data.user));

    // Update React state
    setUser(data.user);

    return data;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      // If your backend has a logout endpoint, call it.
      // With normal JWT authentication, the important part
      // is removing the token from the client.
      await logoutRequest();
    } catch (error) {
      // Even if backend logout fails,
      // we should still log the user out locally.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    }
  };

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}