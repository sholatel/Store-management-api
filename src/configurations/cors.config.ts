import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = (origins: string): string[] => {
  return origins
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);
};

const getCorsOptions = (): CorsOptions => {
  // Default to development origins if not specified
  const defaultOrigins = 'http://localhost:3000';
  const allowedOrigins = process.env.ALLOWED_ORIGINS || defaultOrigins;

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const origins = parseOrigins(allowedOrigins);
      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  };
};

export const corsOptions = getCorsOptions();