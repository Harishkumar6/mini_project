const User = require('../models/User');
const Progress = require('../models/Progress');
const { generatePersonalizedRoadmap } = require('../services/roadmapEngine');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, college, department, yearOfStudy } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Email, Password)',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      college: college || 'General Institute of Technology',
      department: department || 'Computer Science & Engineering',
      yearOfStudy: yearOfStudy || 'Final Year',
      role: 'student',
    });

    // Create initial Progress record
    await Progress.create({ user: user._id });

    // Initialize initial Roadmap
    try {
      await generatePersonalizedRoadmap(user._id);
    } catch (e) {
      console.log('Roadmap initial build note:', e.message);
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account disabled. Please contact system administrator.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    // Update streak / last active date
    const now = new Date();
    const lastActive = new Date(user.lastActiveDate || now);
    const diffHours = (now - lastActive) / (1000 * 60 * 60);

    if (diffHours >= 24 && diffHours <= 48) {
      user.streak += 1;
    } else if (diffHours > 48) {
      user.streak = 1;
    }
    user.lastActiveDate = now;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, college, department, yearOfStudy } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (college) user.college = college;
    if (department) user.department = department;
    if (yearOfStudy) user.yearOfStudy = yearOfStudy;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to send JWT token in response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      streak: user.streak,
      xp: user.xp,
    },
  });
};
