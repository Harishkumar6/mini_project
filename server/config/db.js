const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/preppilot';

    // Attempt to connect to local/provided MongoDB first with a short timeout
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[PrepPilot DB] MongoDB Connected to local/provided instance: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('[PrepPilot DB] Local MongoDB server not reachable on default port. Launching in-memory fallback server...');
      
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[PrepPilot DB] MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`[PrepPilot DB Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
