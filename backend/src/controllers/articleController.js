import Article from "../models/Article.js";


export const createArticle = async (req, res) => {
  try {
    const { title, category, contentBlocks } = req.body;

    if (!title || !category || !contentBlocks) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const article = await Article.create({
      title,
      category,
      contentBlocks,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Article created successfully",
      article,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({  isDeleted: false,}).populate(
      "createdBy",
      "name email role"
    );

    res.status(200).json({
      count: articles.length,
      articles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).populate(
      "createdBy",
      "name email role"
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, contentBlocks } = req.body;

    const article = await Article.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    // Only creator can update
    if (article.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this article",
      });
    }

    article.title = title ?? article.title;
    article.category = category ?? article.category;
    article.contentBlocks = contentBlocks ?? article.contentBlocks;

    const updatedArticle = await article.save();

    res.status(200).json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // Find article
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    // Only creator can delete
    if (article.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this article",
      });
    }

   article.isDeleted = true;
article.deletedAt = new Date();

await article.save();

res.status(200).json({
  message: "Article deleted successfully",
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};