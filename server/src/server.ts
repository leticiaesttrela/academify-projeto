import cors from 'cors';
import express from 'express';
import { router } from './routes';

const app = express()

app.use(express.static('public'));
app.use(express.json())
app.use(cors({ origin: '*' }));

app.use('/api/v1', router)

app.use((req, res, next) => {
  res.status(404).send('Content not found');
});

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000')
});