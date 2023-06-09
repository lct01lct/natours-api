import { readFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import '@/app'; // config env
import { ReviewModel, TourModel, User, UserModel } from '@/models';
import { Tour } from '@/models';
import { logger } from '@/utils';

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  logger.success('DB connection successful!');
});

const readFiles = <T>(path: string): T[] => {
  return JSON.parse(readFileSync(join(__dirname, path), 'utf-8'));
};

const tours = readFiles<Tour>('./tours.json');
const users = readFiles<User>('./users.json');
const reviews = readFiles<User>('./reviews.json');

const importData = async () => {
  try {
    await Promise.all([
      TourModel.create(tours),
      UserModel.create(users, { validateBeforeSave: false }),
      ReviewModel.create(reviews),
    ]);
    logger.success('Data successfully loaded!');
  } catch (err) {
    logger.error(err);
  }
};

const deleteData = async () => {
  try {
    await Promise.all([TourModel.deleteMany(), UserModel.deleteMany(), ReviewModel.deleteMany()]);
    logger.success('Data successfully deleted!');
  } catch (err) {
    logger.error(err);
  }
};

const init = async () => {
  const opt = process.argv[3] as '--import' | '--delete' | '';

  if (opt === '--delete') {
    await deleteData();
  } else if (opt === '--import') {
    await importData();
  } else {
    await deleteData();
    await importData();
  }
  process.exit();
};

init();
