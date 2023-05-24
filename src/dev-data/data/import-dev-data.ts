import { readFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import '@/app'; // config env
import { TourModel } from '@/models';
import { Tour } from '@/models';
import { logger } from '@/utils';

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  logger.success('DB connection successful!');
});

const tours: Tour[] = JSON.parse(readFileSync(join(__dirname, '/tours-simple.json'), 'utf-8'));

const importData = async () => {
  try {
    await TourModel.create(tours);
    logger.success('Data successfully loaded!');
  } catch (err) {
    logger.error(err);
  }
};

const deleteData = async () => {
  try {
    await TourModel.deleteMany();
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
