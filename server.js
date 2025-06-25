const path = require('node:path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, 'config.env') });
const mongoose = require('mongoose');

// this should be imported only after variables are imported in process.env
const app = require('./app');

const PORT = process.env.PORT;

// DB CONNECTION
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.log(connection.connections);
    console.log('DB connection successful');
  });

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
