/**
 * Validate that all required environment variables are set
 */
export const validateEnv = (): void => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'MONGODB_URI',
    'GEMINI_API_KEY',
  ];

  const missing: string[] = [];

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName] || process.env[varName]?.trim() === '') {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please create a .env file in the backend directory with:');
    console.error('   PORT=5000');
    console.error('   MONGODB_URI=mongodb://localhost:27017/interviewai');
    console.error('   JWT_SECRET=your_super_secret_jwt_key_min_32_characters');
    console.error('   GEMINI_API_KEY=your_gemini_api_key_here\n');
    process.exit(1);
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters long for security');
  }

  // Validate GEMINI_API_KEY format (should start with AIza)
  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.warn('⚠️  Warning: GEMINI_API_KEY format looks incorrect. Valid keys usually start with "AIza"');
  }
};
