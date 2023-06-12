import express from 'express';
import morgan from 'morgan';
import { config as dotenvConfig } from 'dotenv';
import initRoutes from './routes';
import { errorHandler } from './middleware';
import { join } from 'path';
import { protectApp } from '@/utils';
import cookieParser from 'cookie-parser';

// Reading config.env
// Ensure config before using all enviroment variable
const dotenvConfigOutput = dotenvConfig({ path: `${__dirname}/../config.env` });
if (!dotenvConfigOutput.parsed) throw new Error("Dotenv don't get enviroment variable!");

const app = express();

app.set('view engine', 'pug');
app.set('views', join(__dirname, './views'));

// Hosting static resources
app.use(express.static(join(__dirname, './public')));

// Handy Showing request information in terminal
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// Parsing req.body
app.use(express.json({ limit: '10kb' }));
// Parsing cookie
app.use(cookieParser());

protectApp(app);

initRoutes(app);

app.use(errorHandler);

export default app;
