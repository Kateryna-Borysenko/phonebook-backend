import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import contactRouter from './routes/contactRouter.js';
import userRouter from './routes/userRouter.js';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

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

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('🌱 Database connected successfully ...');
  app.listen(5000, () => console.log(`💻 Server running  on port  5000 ...`));
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
