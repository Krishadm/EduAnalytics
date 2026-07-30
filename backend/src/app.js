import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { protect, authorize } from "./middleware/authMiddleware.js";
import articleRoutes from "./routes/articleRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import highlightRoutes from "./routes/highlightRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://eduanalytics-fe.onrender.com",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (Postman, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("/*path", cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/student/highlights", highlightRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/profile", protect, (req, res) => {
  res.json(req.user);
});

app.get("/api/teacher", protect, authorize("teacher"), (req, res) => {
  res.json({
    message: "Welcome Teacher",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Student Performance API Running...",
  });
});

export default app;