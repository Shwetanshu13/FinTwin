import dotenv from 'dotenv';

dotenv.config();

export const config = {
    dbUrl: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '1h',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    geminiEnabled: (process.env.GEMINI_ENABLED || '').toLowerCase() === 'true',
}