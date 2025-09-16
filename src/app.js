import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import securityMiddleware from './middlewares/security.middleware.js';

const app = express();
app.use(helmet());
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.use(securityMiddleware)

app.get('/', (req, res) => {
  logger.info('Hello world route was called');
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);

export default app;
