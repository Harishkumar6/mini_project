const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');

exports.getAchievements = async (req, res, next) => {
  try {
    const allAchievements = await Achievement.find().sort({ createdAt: 1 });

    let unlockedMap = {};
    if (req.user) {
      const userAchievements = await UserAchievement.find({ user: req.user.id });
      userAchievements.forEach((ua) => {
        unlockedMap[ua.achievement.toString()] = ua.unlockedAt;
      });
    }

    const data = allAchievements.map((a) => {
      const isUnlocked = Boolean(unlockedMap[a._id.toString()]);
      return {
        ...a.toObject(),
        isUnlocked,
        unlockedAt: isUnlocked ? unlockedMap[a._id.toString()] : null,
      };
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.createAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json({ success: true, data: achievement, message: 'Achievement created' });
  } catch (error) {
    next(error);
  }
};
