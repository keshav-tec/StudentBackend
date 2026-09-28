import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// LOGIN
// ===============================

export async function loginRequest(credentials) {
  const response = await api.post(
    "/api/auth/login",
    credentials
  );

  return response.data;
}

// ===============================
// CURRENT USER
// ===============================

export async function sendEmailOTP(email) {
  const response = await api.post("/api/auth/send-otp", {
    email,
  });

  return response.data;
}

export async function verifyEmailOTP(email, otp) {
  const response = await api.post("/api/auth/verify-otp", {
    email,
    otp,
  });

  return response.data;
}

export async function getMeRequest() {
  const response = await api.get(
    "/api/auth/me"
  );

  return response.data;
}

// ===============================
// SIGNUP / REGISTER
// ===============================

export async function signupRequest(userData) {
  const response = await api.post(
    "/api/auth/register",
    userData
  );

  return response.data;
}

// Alias for any existing code using registerRequest
export const registerRequest = signupRequest;

// ===============================
// LOGOUT
// ===============================

export async function logoutRequest() {
  const response = await api.post(
    "/api/auth/logout"
  );

  return response.data;
}

// ===============================
// API ERROR HELPER
// ===============================

export function getApiErrorMessage(
  error,
  fallback = "Something went wrong"
) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export default api;