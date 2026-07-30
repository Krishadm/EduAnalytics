import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import highlightRoutes from "./routes/highlightRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { protect, authorize } from "./middleware/authMiddleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://eduanalytics-fe.onrender.com",
];

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, curl, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/student/highlights", highlightRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Protected Routes
app.get("/api/profile", protect, (req, res) => {
  res.json(req.user);
});

app.get("/api/teacher", protect, authorize("teacher"), (req, res) => {
  res.json({
    message: "Welcome Teacher",
  });
});

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Performance API Running...",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  if (err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;