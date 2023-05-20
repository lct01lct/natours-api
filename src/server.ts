import app from './app';
import mongoose from 'mongoose';

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`App running on http://127.0.0.1:${PORT} ...`);
});
