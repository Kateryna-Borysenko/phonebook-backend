import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import contactRouter from './routes/contactRouter.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

app.listen(5000, () => console.log(`💻 Server running  on port  5000 ...`));
