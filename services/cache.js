const mongoose = require('mongoose');

// Store the original exec function
const exec = mongoose.Query.prototype.exec;

// We are override the Query exec function
mongoose.Query.prototype.exec = function () {
  //This allows to run some code before the original exec function is run,
  // i.e. before the query is executed

  console.log('I am about to run a query');
  const currentQueryFilter = this.getQuery();
  console.log(currentQueryFilter);

  //1. Check if the query has been cached
  //2. If it has, then return that
  //3. Otherwise, issue the query and store the result in cache

  // 'this' is Query
  return exec.apply(this, arguments);
};
