import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { protect,authorize  } from "./middleware/authMiddleware.js";
import articleRoutes from "./routes/articleRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import highlightRoutes from "./routes/highlightRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.get("/api/profile", protect, (req, res) => {
  res.json(req.user);
});
app.get(
  "/api/teacher",
  protect,
  authorize("teacher"),
  (req, res) => {
    res.json({
      message: "Welcome Teacher",
    });
  }
);
app.get("/", (req, res) => {
  res.json({
    message: "Student Performance API Running..."
  });
});
app.use("/api/analytics", analyticsRoutes);
app.use("/api/student/highlights", highlightRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;