import 'dotenv/config';
import express from 'express';
import uploadRouter from './routes/upload.js';
import indexRouter from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use('/', indexRouter);
app.use('/api', uploadRouter);

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});