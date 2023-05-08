require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

// mongoose.Promise = global.Promise;
console.log('Am I being run?');
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

afterAll(async () => {
  await mongoose.disconnect();
});
