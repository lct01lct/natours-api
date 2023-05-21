import app from './app';
import mongoose, { Document } from 'mongoose';
import { greenLog } from './utils';

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  greenLog('DB connection successful!');
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  greenLog(`App running on http://127.0.0.1:${PORT}`);
});
