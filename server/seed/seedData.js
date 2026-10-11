const seedCategories = [
  {
    name: 'Aptitude',
    slug: 'aptitude',
    description: 'Quantitative aptitude, numerical reasoning, speed math, and mathematical problem-solving skills required for technical placement exams.',
    icon: 'Calculator',
    order: 1,
  },
  {
    name: 'Problem Solving',
    slug: 'problem-solving',
    description: 'Logical reasoning, analytical puzzles, data interpretation, and abstract pattern recognition.',
    icon: 'Brain',
    order: 2,
  },
  {
    name: 'Communication',
    slug: 'communication',
    description: 'Verbal ability, English grammar, corporate reading comprehension, vocabulary, and business communication skills.',
    icon: 'MessageSquare',
    order: 3,
  },
];

const seedAchievements = [
  {
    code: 'ACH_FIRST_STEP',
    title: 'First Step',
    description: 'Complete your first placement learning topic material.',
    icon: 'Sparkles',
    category: 'Learning',
    xpReward: 50,
    conditionType: 'TOPIC_COMPLETE',
    threshold: 1,
  },
  {
    code: 'ACH_PRACTICE_STARTER',
    title: 'Practice Starter',
    description: 'Answer 10 practice questions accurately.',
    icon: 'Target',
    category: 'Practice',
    xpReward: 100,
    conditionType: 'PRACTICE_COUNT',
    threshold: 5,
  },
  {
    code: 'ACH_ASSESSMENT_READY',
    title: 'Assessment Ready',
    description: 'Complete your first placement mock assessment.',
    icon: 'Award',
    category: 'Assessment',
    xpReward: 150,
    conditionType: 'ASSESSMENT_COMPLETE',
    threshold: 1,
  },
  {
    code: 'ACH_PERFECT_SCORE',
    title: 'Perfect Score',
    description: 'Score 100% on any full-length mock assessment.',
    icon: 'Crown',
    category: 'Assessment',
    xpReward: 300,
    conditionType: 'PERFECT_SCORE',
    threshold: 1,
  },
  {
    code: 'ACH_CODING_BEGINNER',
    title: 'Coding Beginner',
    description: 'Pass all test cases for your first coding problem.',
    icon: 'Code2',
    category: 'Coding',
    xpReward: 200,
    conditionType: 'CODING_COMPLETE',
    threshold: 1,
  },
];

module.exports = {
  seedCategories,
  seedAchievements,
};
