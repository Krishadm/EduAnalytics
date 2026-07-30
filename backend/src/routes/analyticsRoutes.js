import express from "express";
import { trackArticle } from "../controllers/analyticsController.js";
import { getTeacherDashboard, getStudentDashboard } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/tracking",
  protect,
  authorize("student","teacher"),
  trackArticle
);

router.get(
  "/",
  protect,
  authorize("teacher"),
  getTeacherDashboard
);

router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentDashboard
);

export default router;