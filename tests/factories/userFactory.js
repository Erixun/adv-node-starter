const mongoose = require('mongoose');
// const User = mongoose.model('User');
const User = require('../../models/User');

const userFactory = async () =>
  new User({}).save().catch((error) => {
    console.log(error);
  });

module.exports = userFactory;
