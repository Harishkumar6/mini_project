const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Topic = require('../models/Topic');
const LearningMaterial = require('../models/LearningMaterial');
const Question = require('../models/Question');
const CodingProblem = require('../models/CodingProblem');
const Assessment = require('../models/Assessment');
const Achievement = require('../models/Achievement');
const Progress = require('../models/Progress');

dotenv.config();

const seedAll = async () => {
  try {
    console.log('[Seeder] Cleaning existing database collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Topic.deleteMany();
    await LearningMaterial.deleteMany();
    await Question.deleteMany();
    await CodingProblem.deleteMany();
    await Assessment.deleteMany();
    await Achievement.deleteMany();
    await Progress.deleteMany();

    console.log('[Seeder] Creating Admin & Demo Student Accounts...');
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@preppilot.com',
      password: 'admin123',
      role: 'admin',
      college: 'PrepPilot Admin HQ',
      department: 'Placement Cell',
      yearOfStudy: 'Final Year',
    });

    const student = await User.create({
      name: 'Alex Sharma',
      email: 'student@preppilot.com',
      password: 'student123',
      role: 'student',
      college: 'Apex Institute of Technology',
      department: 'Computer Science & Engineering',
      yearOfStudy: 'Final Year',
      streak: 5,
      xp: 450,
    });

    await Progress.create({ user: student._id });

    console.log('[Seeder] Creating Categories...');
    const catAptitude = await Category.create({
      name: 'Aptitude',
      slug: 'aptitude',
      description: 'Quantitative aptitude, numerical reasoning, speed math, and problem-solving skills required for technical placement exams.',
      icon: 'Calculator',
      order: 1,
    });

    const catProblemSolving = await Category.create({
      name: 'Problem Solving',
      slug: 'problem-solving',
      description: 'Logical reasoning, analytical puzzles, data interpretation, and abstract pattern recognition.',
      icon: 'Brain',
      order: 2,
    });

    const catCommunication = await Category.create({
      name: 'Communication',
      slug: 'communication',
      description: 'Verbal ability, English grammar, corporate reading comprehension, vocabulary, and business communication skills.',
      icon: 'MessageSquare',
      order: 3,
    });

    console.log('[Seeder] Creating Topics...');
    // Aptitude Topics
    const topicPercentages = await Topic.create({
      title: 'Percentages',
      slug: 'percentages',
      category: catAptitude._id,
      description: 'Master percentage calculations, fraction conversions, net changes, and application in business problems.',
      difficulty: 'Easy',
      estimatedMinutes: 25,
      order: 1,
    });

    const topicProfitLoss = await Topic.create({
      title: 'Profit and Loss',
      slug: 'profit-and-loss',
      category: catAptitude._id,
      description: 'Cost price, selling price, marked price, discount calculations, and margin optimization.',
      difficulty: 'Medium',
      estimatedMinutes: 30,
      order: 2,
    });

    const topicTimeWork = await Topic.create({
      title: 'Time and Work',
      slug: 'time-and-work',
      category: catAptitude._id,
      description: 'Work efficiency, man-days concept, pipe & cisterns, and collaborative work calculations.',
      difficulty: 'Medium',
      estimatedMinutes: 30,
      order: 3,
    });

    // Problem Solving Topics
    const topicLogicalReasoning = await Topic.create({
      title: 'Logical Reasoning',
      slug: 'logical-reasoning',
      category: catProblemSolving._id,
      description: 'Syllogisms, blood relations, direction sense, coding-decoding, and seating arrangements.',
      difficulty: 'Medium',
      estimatedMinutes: 25,
      order: 1,
    });

    const topicDataInterpretation = await Topic.create({
      title: 'Data Interpretation',
      slug: 'data-interpretation',
      category: catProblemSolving._id,
      description: 'Bar graphs, pie charts, table charts, line graphs, and data sufficiency analysis.',
      difficulty: 'Hard',
      estimatedMinutes: 35,
      order: 2,
    });

    // Communication Topics
    const topicGrammar = await Topic.create({
      title: 'Grammar & Verbal Ability',
      slug: 'grammar-verbal-ability',
      category: catCommunication._id,
      description: 'Subject-verb agreement, tenses, active/passive voice, idioms, and sentence correction.',
      difficulty: 'Easy',
      estimatedMinutes: 20,
      order: 1,
    });

    console.log('[Seeder] Creating Learning Materials...');
    await LearningMaterial.create({
      topic: topicPercentages._id,
      overview: 'Percentage represents a fraction of 100. It is a fundamental concept used across quantitative aptitude, data interpretation, and business calculations.',
      keyConcepts: [
        {
          title: 'Fraction to Percentage Conversion',
          content: 'To convert any fraction a/b into percentage, multiply by 100%. Example: 1/4 = 0.25 * 100 = 25%.',
        },
        {
          title: 'Percentage Change Formula',
          content: 'Percentage Change = ((Final Value - Initial Value) / Initial Value) * 100%.',
        },
        {
          title: 'Successive Percentage Changes',
          content: 'If a quantity changes by a% and then by b%, Net % Change = a + b + (a * b)/100 %.',
        },
      ],
      formulas: [
        {
          title: 'Basic Percentage',
          formula: 'Percentage = (Value / Total) * 100',
          explanation: 'Calculates the proportion of a value relative to the whole.',
        },
        {
          title: 'Percentage Increase',
          formula: '% Increase = (Increase / Original Value) * 100',
          explanation: 'Determines the relative growth of a quantity.',
        },
      ],
      solvedExamples: [
        {
          question: 'If the salary of an employee is increased from $50,000 to $60,000, what is the percentage increase?',
          solution: 'Increase = $60,000 - $50,000 = $10,000. % Increase = (10,000 / 50,000) * 100 = 20%.',
          explanation: 'Divide the net increase by original baseline salary and multiply by 100.',
        },
        {
          question: 'A price of an item is reduced by 20% and then increased by 10%. What is the net percentage change?',
          solution: 'Net Change = -20 + 10 + ((-20 * 10) / 100) = -10 - 2 = -12%.',
          explanation: 'Using the successive percentage change formula yields a 12% net decrease.',
        },
      ],
      summary: 'Mastering fractions to percentages (e.g. 1/8 = 12.5%, 1/6 = 16.66%) will dramatically boost your calculation speed during placement exams.',
    });

    await LearningMaterial.create({
      topic: topicProfitLoss._id,
      overview: 'Profit and Loss equations form the baseline for commercial math in campus hiring assessments.',
      keyConcepts: [
        { title: 'Cost Price (CP)', content: 'The price at which an item is purchased.' },
        { title: 'Selling Price (SP)', content: 'The price at which an item is sold to customer.' },
      ],
      formulas: [
        { title: 'Profit %', formula: 'Profit % = ((SP - CP) / CP) * 100', explanation: 'Profit percentage is always calculated on CP unless stated otherwise.' },
      ],
      solvedExamples: [
        {
          question: 'An item bought for $400 is sold for $500. Calculate profit percentage.',
          solution: 'Profit = 500 - 400 = 100. Profit % = (100 / 400) * 100 = 25%.',
          explanation: 'Profit percentage is calculated on cost price.',
        },
      ],
      summary: 'Always reference Profit/Loss against Cost Price unless explicitly specified.',
    });

    console.log('[Seeder] Creating Practice Questions...');
    const q1 = await Question.create({
      questionText: 'What is 15% of 480?',
      category: catAptitude._id,
      topic: topicPercentages._id,
      difficulty: 'Easy',
      options: ['64', '72', '80', '68'],
      correctOptionIndex: 1,
      explanation: '10% of 480 is 48. 5% of 480 is 24. 48 + 24 = 72.',
    });

    const q2 = await Question.create({
      questionText: 'If a student scores 45 out of 60 in an aptitude test, what is their percentage?',
      category: catAptitude._id,
      topic: topicPercentages._id,
      difficulty: 'Easy',
      options: ['70%', '75%', '80%', '65%'],
      correctOptionIndex: 1,
      explanation: '(45 / 60) * 100 = 3/4 * 100 = 75%.',
    });

    const q3 = await Question.create({
      questionText: 'A trader buys a watch for $1,200 and sells it for $1,500. What is his profit percentage?',
      category: catAptitude._id,
      topic: topicProfitLoss._id,
      difficulty: 'Medium',
      options: ['20%', '25%', '30%', '15%'],
      correctOptionIndex: 1,
      explanation: 'Profit = $300. Profit % = (300 / 1200) * 100 = 25%.',
    });

    const q4 = await Question.create({
      questionText: 'If A can complete a work in 10 days and B in 15 days, how many days will they take together?',
      category: catAptitude._id,
      topic: topicTimeWork._id,
      difficulty: 'Medium',
      options: ['5 days', '6 days', '7.5 days', '8 days'],
      correctOptionIndex: 1,
      explanation: '1 day work = 1/10 + 1/15 = (3 + 2)/30 = 5/30 = 1/6. Total days = 6 days.',
    });

    const q5 = await Question.create({
      questionText: 'Pointing to a photograph, Rohit said "She is the daughter of my grandfather\'s only son." How is the girl related to Rohit?',
      category: catProblemSolving._id,
      topic: topicLogicalReasoning._id,
      difficulty: 'Medium',
      options: ['Mother', 'Sister', 'Aunt', 'Cousin'],
      correctOptionIndex: 1,
      explanation: "Rohit's grandfather's only son is Rohit's father. The daughter of Rohit's father is Rohit's sister.",
    });

    const q6 = await Question.create({
      questionText: 'Choose the correctly spelled word for formal business context:',
      category: catCommunication._id,
      topic: topicGrammar._id,
      difficulty: 'Easy',
      options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accomodett'],
      correctOptionIndex: 1,
      explanation: 'Accommodate is spelled with double c and double m.',
    });

    console.log('[Seeder] Creating Coding Problems...');
    await CodingProblem.create({
      title: 'Two Sum Problem',
      category: catProblemSolving._id,
      difficulty: 'Easy',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
      inputFormat: 'Line 1: Array of integers separated by space. Line 2: Target integer.',
      outputFormat: 'Array of two 0-indexed integers [i, j].',
      constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9',
      sampleCases: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0, 1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
      ],
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0, 1]', isHidden: false },
        { input: '[3,2,4], 6', expectedOutput: '[1, 2]', isHidden: false },
        { input: '[3,3], 6', expectedOutput: '[0, 1]', isHidden: true },
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
        python: `def twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n    return []`,
      },
      expectedConcept: 'Hash Table / Two Pointers',
    });

    await CodingProblem.create({
      title: 'Valid Palindrome',
      category: catProblemSolving._id,
      difficulty: 'Easy',
      description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
      inputFormat: 'Single string line input.',
      outputFormat: 'Boolean true or false.',
      constraints: '1 <= s.length <= 2 * 10^5',
      sampleCases: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: 'true',
          explanation: '"amanaplanacanalpanama" is a palindrome.',
        },
      ],
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false },
        { input: '"race a car"', expectedOutput: 'false', isHidden: false },
      ],
      starterCode: {
        javascript: `function isPalindrome(s) {\n  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return cleaned === cleaned.split('').reverse().join('');\n}`,
      },
      expectedConcept: 'String Manipulation / Two Pointers',
    });

    console.log('[Seeder] Creating Assessments...');
    await Assessment.create({
      title: 'Quantitative Aptitude Diagnostic Test',
      description: 'Comprehensive evaluation of numerical speed, percentages, profit & loss, and time-work fundamentals for technical campus drives.',
      category: catAptitude._id,
      difficulty: 'Medium',
      timeLimitMinutes: 15,
      questions: [q1._id, q2._id, q3._id, q4._id],
      totalMarks: 100,
      passingPercentage: 60,
      isPublished: true,
    });

    await Assessment.create({
      title: 'Logical Reasoning & Verbal Skill Mock',
      description: 'Placement screening test covering blood relations, direction sense, and English verbal fluency.',
      category: catProblemSolving._id,
      difficulty: 'Easy',
      timeLimitMinutes: 10,
      questions: [q5._id, q6._id],
      totalMarks: 50,
      passingPercentage: 60,
      isPublished: true,
    });

    console.log('[Seeder] Creating System Achievements...');
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
        description: 'Answer 5 practice questions accurately.',
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

    await Achievement.insertMany(seedAchievements);

    console.log('[Seeder] Database Seeding Completed Successfully! Demo credentials:');
    console.log('   Admin Account: admin@preppilot.com / admin123');
    console.log('   Student Account: student@preppilot.com / student123');
  } catch (error) {
    console.error('[Seeder Error]:', error);
  }
};

if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedAll();
    process.exit(0);
  });
}

module.exports = seedAll;
