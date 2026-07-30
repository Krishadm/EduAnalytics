import express from "express";
import {
  teacherDashboard,
  articlesVsViews,
  categoryDistribution,
  dailyEngagement,
} from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/teacher",
  protect,
  authorize("teacher"),
  teacherDashboard
);

router.get(
  "/articles-vs-views",
  protect,
  authorize("teacher"),
  articlesVsViews
);

router.get(
  "/category-distribution",
  protect,
  authorize("teacher"),
  categoryDistribution
);

router.get(
  "/daily-engagement",
  protect,
  authorize("teacher"),
  dailyEngagement
);

export default router;