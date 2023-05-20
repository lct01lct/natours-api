import express from 'express';
import morgan from 'morgan';
import { config as dotenvConfig } from 'dotenv';
import initRoutes from './routes';

// Reading config.env
// Ensure declare before using all enviroment variable
const dotenvConfigOutput = dotenvConfig({ path: `${__dirname}/../config.env` });
if (!dotenvConfigOutput.parsed) throw new Error("Dotenv don't get enviroment variable!");

const app = express();

// Handy Showing request information in terminal
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// Parsing req.body
app.use(express.json());
// Hosting static resources
app.use(express.static(`${__dirname}/public`));

initRoutes(app);

export default app;
