import Highlight from "../models/Highlight.js";

export const saveHighlight = async (req, res) => {
  try {
    const { articleId, text, note } = req.body;

    const highlight = await Highlight.create({
      studentId: req.user._id,
    articleId,
      text,note,
    });

    res.status(201).json({
      message: "Highlight saved successfully",
      highlight,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyHighlights = async (req, res) => {
  try {
    const highlights = await Highlight.find({
      studentId: req.user._id,
    })
      .populate("articleId", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json(highlights);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};