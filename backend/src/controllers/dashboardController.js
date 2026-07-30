import Article from "../models/Article.js";
import Analytics from "../models/Analytics.js";

export const teacherDashboard = async (req, res) => {
  try {
    const teacherArticles = await Article.find({
      createdBy: req.user._id,
      isDeleted: false,
    }).select("_id category");

    const articleIds = teacherArticles.map((a) => a._id);

    const categoryMap = {};
    teacherArticles.forEach((a) => {
      categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const analytics = await Analytics.find({ articleId: { $in: articleIds } }).select("studentId");

    const totalStudentsRead = new Set(analytics.map((a) => a.studentId.toString())).size;

    res.status(200).json({
      totalArticles: teacherArticles.length,
      totalStudentsRead,
      topCategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const articlesVsViews = async (req, res) => {
  try {
    const articles = await Article.find({
      createdBy: req.user._id,
      isDeleted: false,
    }).select("_id title");

    const articleIds = articles.map((a) => a._id);
    const titleMap = Object.fromEntries(articles.map((a) => [a._id.toString(), a.title]));

    const analytics = await Analytics.find({ articleId: { $in: articleIds } }).select("articleId views");

    const viewsMap = {};
    analytics.forEach(({ articleId, views }) => {
      const id = articleId.toString();
      viewsMap[id] = (viewsMap[id] || 0) + views;
    });

    const data = Object.entries(viewsMap)
      .map(([id, totalViews]) => ({ article: titleMap[id], totalViews }))
      .sort((a, b) => b.totalViews - a.totalViews);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const categoryDistribution = async (req, res) => {
  try {
    const articles = await Article.find({
      createdBy: req.user._id,
      isDeleted: false,
    }).select("category");

    const categoryMap = {};
    articles.forEach(({ category }) => {
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const data = Object.entries(categoryMap).map(([category, total]) => ({ category, total }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dailyEngagement = async (req, res) => {
  try {
    const articles = await Article.find({
      createdBy: req.user._id,
      isDeleted: false,
    }).select("_id");

    const articleIds = articles.map((a) => a._id);

    const analytics = await Analytics.find({ articleId: { $in: articleIds } }).select("views createdAt");

    const dailyMap = {};
    analytics.forEach(({ views, createdAt }) => {
      const day = createdAt.toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + views;
    });

    const data = Object.entries(dailyMap)
      .map(([_id, totalViews]) => ({ _id, totalViews }))
      .sort((a, b) => a._id.localeCompare(b._id));

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherArticles = await Article.find({ createdBy: req.user._id, isDeleted: false });
    const articleIds = teacherArticles.map(a => a._id);

    const analytics = await Analytics.find({ articleId: { $in: articleIds } });
    const totalStudentsRead = new Set(analytics.map(a => a.studentId.toString())).size;

    const categoryMap = {};
    teacherArticles.forEach(a => {
      categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(categoryMap).map(([category, count]) => ({ category, count }));
    const topCategories = [...categoryDistribution].sort((a, b) => b.count - a.count);

    const articlesVsViews = teacherArticles.map(a => {
      const views = analytics.filter(an => an.articleId.toString() === a._id.toString())
                            .reduce((sum, curr) => sum + curr.views, 0);
      return { title: a.title, views };
    });

    const dailyMap = {};
    analytics.forEach(an => {
      if (an.createdAt) {
        const date = an.createdAt.toISOString().slice(0, 10);
        dailyMap[date] = (dailyMap[date] || 0) + an.views;
      }
    });
    const dailyEngagement = Object.entries(dailyMap)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json({
      articlesCreated: teacherArticles.length,
      totalStudentsRead,
      topCategories,
      categoryDistribution,
      articlesVsViews,
      dailyEngagement
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    const analytics = await Analytics.find({ studentId }).populate("articleId");
    const validAnalytics = analytics.filter(an => an.articleId && !an.articleId.isDeleted);

    const totalArticlesRead = validAnalytics.length;

    const timeMap = {};
    validAnalytics.forEach(an => {
      const category = an.articleId.category || "Other";
      timeMap[category] = (timeMap[category] || 0) + (an.duration || 0);
    });
    const timePerCategory = Object.entries(timeMap).map(([category, duration]) => ({
      category,
      duration
    }));

    const readArticles = validAnalytics.map(an => ({
      article: an.articleId,
      duration: an.duration,
      views: an.views
    }));

    res.status(200).json({
      totalArticlesRead,
      timePerCategory,
      readArticles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
