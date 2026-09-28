import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Automatically attach JWT to every protected request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT:
    // FormData must NOT have Content-Type manually set.
    // The browser/Axios will automatically generate:
    // multipart/form-data; boundary=...
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==================================================
// STUDENT PROFILE
// ==================================================

export async function getStudentProfile() {
  const response = await api.get("/api/auth/me");

  return {
    success: true,
    data: response.data?.user,
  };
}

// ==================================================
// TUTORS
// ==================================================

export async function getTutors(params = {}) {
  const response = await api.get("/api/tutors", {
    params,
  });

  return {
    success: true,
    data: response.data?.tutors || [],
  };
}

export async function getTutor(tutorId) {
  const response = await api.get(`/api/tutors/${tutorId}`);

  return {
    success: true,
    data: response.data,
  };
}

export async function getTutorMatches(doubtId) {
  const response = await api.get(`/api/tutors/matches/${doubtId}`);

  return {
    success: true,
    data: response.data?.matches || [],
  };
}

// ==================================================
// DOUBTS
// ==================================================

export async function getDoubts(params = {}) {
  const response = await api.get("/api/doubts", {
    params,
  });

  return {
    success: true,
    data: response.data?.doubts || [],
    count: response.data?.count || 0,
  };
}

export async function getDoubt(doubtId) {
  const response = await api.get(`/api/doubts/${doubtId}`);

  return {
    success: true,
    data: response.data?.doubt,
  };
}

export async function submitTextDoubt(question) {
  const response = await api.post("/api/doubts/text", {
    question,
  });

  return {
    success: true,
    data: response.data?.doubt,
    matches: response.data?.matches || [],
    message: response.data?.message,
  };
}

export const submitVoiceDoubt = async (formData) => {
  if (!(formData instanceof FormData)) {
    throw new Error("Voice submission requires FormData.");
  }

  console.log("=== VOICE API DEBUG ===");
  console.log("Is FormData:", formData instanceof FormData);

  for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof Blob
        ? {
            type: value.type,
            size: value.size,
            name: value.name,
          }
        : value
    );
  }

  const response = await api.post(
    "/api/doubts/voice",
    formData
  );

  return response.data;
};

 

// Delete student's doubt
export async function deleteDoubt(doubtId) {
  const response = await api.delete(
    `/api/doubts/${doubtId}`
  );

  return {
    success: true,
    message: response.data?.message,
  };
}

// ==================================================
// BOOKINGS
// ==================================================

export async function getBookings() {
  const response = await api.get("/api/bookings/my");

  return {
    success: true,
    data: response.data?.bookings || [],
  };
}

export async function getBooking(bookingId) {
  const response = await api.get(
    `/api/bookings/${bookingId}`
  );

  return {
    success: true,
    data: response.data,
  };
}

export async function bookTutor(
  tutorId,
  bookingData = {}
) {
  const response = await api.post(
    "/api/bookings",
    {
      tutorId,
      ...bookingData,
    }
  );

  return {
    success: true,
    data: response.data,
  };
}

export async function cancelBooking(bookingId) {
  const response = await api.put(
    `/api/bookings/${bookingId}/cancel`
  );

  return {
    success: true,
    data: response.data,
  };
}

export async function completeBooking(
  bookingId,
  bookingData = {}
) {
  const response = await api.put(
    `/api/bookings/${bookingId}/complete`,
    bookingData
  );

  return {
    success: true,
    data: response.data,
  };
}

// ==================================================
// SOLUTIONS
// ==================================================

export async function createSolution(solutionData) {
  const response = await api.post(
    "/api/solutions",
    solutionData
  );

  return {
    success: true,
    data: response.data,
  };
}

export async function getSolutionsByDoubt(doubtId) {
  const response = await api.get(
    `/api/solutions/doubt/${doubtId}`
  );

  return {
    success: true,
    data: response.data,
  };
}

export async function getSolution(solutionId) {
  const response = await api.get(
    `/api/solutions/${solutionId}`
  );

  return {
    success: true,
    data: response.data,
  };
}

export async function updateSolution(
  solutionId,
  solutionData
) {
  const response = await api.put(
    `/api/solutions/${solutionId}`,
    solutionData
  );

  return {
    success: true,
    data: response.data,
  };
}

// ==================================================
// RATINGS
// ==================================================

export async function submitRating(ratingData) {
  const response = await api.post(
    "/api/ratings",
    ratingData
  );

  return {
    success: true,
    data: response.data,
  };
}

export async function getTutorRatings(tutorId) {
  const response = await api.get(
    `/api/ratings/tutor/${tutorId}`
  );

  return {
    success: true,
    data: response.data,
  };
}

// ==================================================
// TUTOR PROFILE
// ==================================================

export async function getMyTutorProfile() {
  const response = await api.get("/api/tutors/me");

  return {
    success: true,
    data: response.data?.profile,
  };
}

export async function updateTutorProfile(profileData) {
  const response = await api.put(
    "/api/tutors/profile",
    profileData
  );

  return {
    success: true,
    data: response.data?.profile,
    message: response.data?.message,
  };
}
// ==================================================
// DEFAULT EXPORT
// ==================================================

export default api;