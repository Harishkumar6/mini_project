const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const autoSeedIfEmpty = require('./seed/autoSeed');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  // Auto-seed sample database if fresh installation
  await autoSeedIfEmpty();
});

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Route files
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const topicRoutes = require('./routes/topicRoutes');
const materialRoutes = require('./routes/materialRoutes');
const questionRoutes = require('./routes/questionRoutes');
const codingRoutes = require('./routes/codingRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/admin', adminRoutes);

// Base route test
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'PrepPilot API Server is running smoothly' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
  );
}

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[PrepPilot Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Server Error]: ${err.message}`);
});
