const path = require('node:path');
const fs = require('node:fs/promises');

const mongoose = require('mongoose');
const config = require('config');

const Tour = require('../../models/tourModel');

// Delete old data
const deleteDocuments = async () => {
  try {
    await Tour.deleteMany();
    console.log('All the data deleted!');
  } catch (error) {
    throw err;
  }
};

// Reading from file and creating the documents if collection is empty
const createDocuments = async () => {
  try {
    const toursData = await fs.readFile(
      path.join(__dirname, '..', 'data', 'tours-simple.json'),
      { encoding: 'utf-8' }
    );
    const toursDataObj = JSON.parse(toursData);
    await Tour.create(toursDataObj);
    console.log('Data successfully loaded!');
  } catch (error) {
    throw error;
  }
};

// DB connection
const DB = config
  .get('database.uri')
  .replace('<PASSWORD>', config.get('database.password'));
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(async (connection) => {
    console.log('DB connection successful');
    if (process.argv[2] === '--import') {
      await createDocuments();
    } else if (process.argv[2] === '--delete') {
      await deleteDocuments();
    }
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
  });
