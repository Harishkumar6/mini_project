const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');

/**
 * Check and evaluate user achievements
 * @param {ObjectId} userId 
 * @param {String} triggerType ('TOPIC_COMPLETE', 'PRACTICE_COUNT', 'ASSESSMENT_COMPLETE', 'PERFECT_SCORE', 'CODING_COMPLETE', 'STREAK', 'ROADMAP_MILESTONE')
 * @param {Number} value Current metric value or condition value
 */
exports.checkAchievements = async (userId, triggerType, value = 1) => {
  try {
    const achievements = await Achievement.find({ conditionType: triggerType });
    if (!achievements || achievements.length === 0) return [];

    const newlyUnlocked = [];

    for (const achievement of achievements) {
      if (value >= achievement.threshold) {
        // Check if already unlocked
        const existing = await UserAchievement.findOne({
          user: userId,
          achievement: achievement._id,
        });

        if (!existing) {
          await UserAchievement.create({
            user: userId,
            achievement: achievement._id,
          });

          // Award XP to User
          await User.findByIdAndUpdate(userId, {
            $inc: { xp: achievement.xpReward },
          });

          newlyUnlocked.push(achievement);
        }
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};
