import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import { PORT, NODE_ENV } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Substract - a backend for substract client app built with Node.js, Express, and MongoDB');
});

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Substract API is running on ${NODE_ENV} at ${PORT}`);
});

try {
  const httpsOptions = {
    cert: fs.readFileSync('/home/ec2-user/subs-track/certs/fullchain.pem'),
    key: fs.readFileSync('/home/ec2-user/subs-track/certs/privkey.pem')
  };

  https.createServer(httpsOptions, app).listen(443, () => {
    console.log('HTTPS server running on port 443');
  });
} catch (error) {
  console.error('Failed to start HTTPS server:', error.message);
}


export default app;

// Todo:
// 1. Add typescipt
// 2. Add swagger
// 3. add logging