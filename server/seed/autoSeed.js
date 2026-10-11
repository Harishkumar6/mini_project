const User = require('../models/User');
const seedAll = require('./seeder');

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] fresh database detected. Automatic initial seeding initiated...');
      await seedAll();
    }
  } catch (error) {
    console.error('[AutoSeed Error]:', error.message);
  }
};

module.exports = autoSeedIfEmpty;
