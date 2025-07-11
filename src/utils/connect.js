const mongoose = require('mongoose');
const config = require('config');

const DB_URI = config
  .get('database.uri')
  .replace('<PASSWORD>', config.get('database.password'));

const connect = async () => {
  await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log('DB connection successful');
};

module.exports = connect;
