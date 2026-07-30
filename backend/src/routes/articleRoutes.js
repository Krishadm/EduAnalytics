import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorize("teacher"),
  upload.single("file"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.status(200).json({
        message: "File uploaded successfully",
        url: fileUrl,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/",
  protect,
  authorize("teacher"),
  createArticle
);

router.get("/", protect, getArticles);

router.get("/:id", protect, getArticleById);

router.put(
  "/:id",     protect, authorize("teacher"),
  updateArticle
);

router.delete(
  "/:id",
  protect,
  authorize("teacher"),
  deleteArticle
);

export default router;