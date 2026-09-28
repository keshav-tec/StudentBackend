import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import solutionRoutes from "./routes/solutionRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import creditRoutes from "./routes/creditRoutes.js";
import studyGroupRoutes from "./routes/studyGroupRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import {
  notFound,
  errorHandler
} from "./middleware/error.js";

const app = express();


// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("CORS origin not allowed"));
    },

    credentials: true
  })
);


// --------------------------------------------------
// SECURITY
// --------------------------------------------------

app.use(helmet());


// --------------------------------------------------
// BODY PARSERS
// --------------------------------------------------

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);


// --------------------------------------------------
// LOGGER
// --------------------------------------------------

app.use(morgan("dev"));


// --------------------------------------------------
// STATIC FILES
// --------------------------------------------------

app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);


// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    name: "Peer Tutoring & Doubt Clearance Exchange API",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});


// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use("/api/auth", authRoutes);

app.use("/api/doubts", doubtRoutes);

app.use("/api/tutors", tutorRoutes);

app.use("/api/solutions", solutionRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/ratings", ratingRoutes);

app.use("/api/credits", creditRoutes);

app.use("/api/study-groups", studyGroupRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/admin", adminRoutes);


// --------------------------------------------------
// ERROR HANDLING
// --------------------------------------------------

app.use(notFound);

app.use(errorHandler);


export default app;