const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
// Store the original exec function
const originalExec = mongoose.Query.prototype.exec;
client.connect().then(() => console.log('Redis Connected!'));

mongoose.Query.prototype.cache = function (options = {}) {
  //Set the useCache property to true for
  //the current query instance:
  this.useCache = true;
  //can be referenced in the exec function
  return this; //to make it chainable
};

// We override the Query exec function
mongoose.Query.prototype.exec = async function () {
  //This allows us to run some code before the original exec function is run,
  // i.e. before the query is executed

  if (!this.useCache) {
    return originalExec.apply(this, arguments);
  }

  // console.log('I am about to run a query');
  const currentQueryFilter = this.getQuery();
  console.log(currentQueryFilter);
  console.log('Mongoose Collection Name:', this.mongooseCollection.name);

  const keyObject = Object.assign({}, currentQueryFilter, {
    collection: this.mongooseCollection.name,
  });
  const key = JSON.stringify(keyObject);

  //1. Check if the query has been cached
  const cachedValue = await client.get(key);
  if (cachedValue) {
    console.log('SERVING FROM REDIS CACHE');
    // console.log(this); this Query has a model property
    const parsedValue = JSON.parse(cachedValue);

    //If the value is an array, we need to convert each element to a mongoose document
    return Array.isArray(parsedValue)
      ? parsedValue.map((doc) => new this.model(doc))
      : new this.model(parsedValue);
  }

  //Creates a new instance of the model from which the query was called
  // const doc = new this.model(JSON.parse(cachedValue));
  // return doc;
  //Similar to doing this:
  // const doc = new Blog({
  //   title: 'hi',
  //   content: 'there',
  // });
  // console.log('Cached Value:', JSON.parse(cachedValue));

  //2. If it has, then return that
  // console.log('Cached Value:', cachedValue ? JSON.parse(cachedValue) : null);
  // if (cachedValue?.length) return JSON.parse(cachedValue);

  //3. Otherwise, issue the query and cache the result
  //'this' is a reference to the current Query instance
  // that we are about to execute

  const mongoDoc = await originalExec.apply(this, arguments);
  //mongoDoc is likely a mongoose document
  //In order to store it in redis, we must convert it to a JSON string
  client.set(key, JSON.stringify(mongoDoc), { EX: 1 });
  console.log('Returning value from MongoDB:', mongoDoc);
  return mongoDoc;
};
