const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app.js');

//Handle any sync error that I could forgot
process.on('uncaughtException', (err) => {
  console.log('uncaught Exception ! shutting down....');
  console.log(err.name, err.message);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db connection successful !'));
//  start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}..`);
});

//handle any async errors that I could forgot to handle
process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection! shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
