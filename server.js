import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import contactRouter from './routes/contactRouter.js';
import userRouter from './routes/userRouter.js';
import cookieParser from 'cookie-parser';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan('tiny'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/api/contacts', contactRouter);
app.use('/api/users', userRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
