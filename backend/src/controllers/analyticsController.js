import Analytics from "../models/Analytics.js";

export const trackArticle = async (req, res) => {
  try {
    const { articleId, duration, action } = req.body;

    let analytics = await Analytics.findOne({
      articleId,
      studentId: req.user._id,
    });

    if (!analytics) {
      analytics = await Analytics.create({
        articleId,
        studentId: req.user._id,
        views: action === 'view' ? 1 : 0,
        duration: action === 'duration' ? (duration || 0) : 0,
      });
    } else {
      if (action === 'view') {
        analytics.views += 1;
      } else if (action === 'duration') {
        analytics.duration += (duration || 0);
      }
      analytics.lastVisited = new Date();
      await analytics.save();
    }

    res.status(200).json({
      message: "Tracking updated successfully",
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};