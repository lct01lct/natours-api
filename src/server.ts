import app from './app';
import mongoose, { Document } from 'mongoose';

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`App running on http://127.0.0.1:${PORT} ...`);
});
