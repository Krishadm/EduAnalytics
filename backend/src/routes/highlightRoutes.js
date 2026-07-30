import express from "express";
import {
  saveHighlight,
  getMyHighlights,
} from "../controllers/highlightController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("student"),
  saveHighlight
);

router.get(
  "/",
  protect,
  authorize("student"),
  getMyHighlights
);

export default router;