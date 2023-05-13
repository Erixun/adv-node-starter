jest.setTimeout(5000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

beforeAll(async () => {
  await mongoose
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
});

afterAll(async () => {
  await mongoose.disconnect();
});
