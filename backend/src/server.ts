import app from './app';
import { connectDB } from './utils/connectDB';
import { validateEnv } from './utils/validateEnv';

// Validate environment variables first
validateEnv();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
