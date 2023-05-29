import express from 'express';
import morgan from 'morgan';
import { config as dotenvConfig } from 'dotenv';
import initRoutes from './routes';
import { errorHandler } from './middleware';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore;
import xssClean from 'xss-clean';
import hpp from 'hpp';

// Reading config.env
// Ensure config before using all enviroment variable
const dotenvConfigOutput = dotenvConfig({ path: `${__dirname}/../config.env` });
if (!dotenvConfigOutput.parsed) throw new Error("Dotenv don't get enviroment variable!");

const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip, please try again one hour!',
}); // allow 100 REQUESTs from the same ip in one hour.

app.use('/api', limiter);

// Set security HTTP headers
app.use(helmet());

// Handy Showing request information in terminal
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// Parsing req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against cross-site scripting
app.use(xssClean());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Hosting static resources
app.use(express.static(`${__dirname}/public`));

initRoutes(app);

app.use(errorHandler);

export default app;
