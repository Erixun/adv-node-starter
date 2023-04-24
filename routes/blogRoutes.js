const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = (app) => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    //TODO: separate setup of redis client from the route handler
    console.log(req.user);
    console.log(req.user._id);
    const blogs = await Blog.findOne({
      _user: req.user._id,
      _id: req.params.id,
    });

    res.send(blogs);

    // const redis = require('redis');
    // const redisUrl = 'redis://127.0.0.1:6379';
    // const client = redis.createClient(redisUrl);
    // await client.connect();
    // //Do we have any cached data in redis related to this query
    // const cachedBlogs = await client
    //   .get(req.params.id)
    //   .then((data) => (data ? JSON.parse(data) : null));

    // //if yes then respond to the request right away and return
    // if (cachedBlogs) {
    //   console.log('Serving from Redis');
    //   return res.send(cachedBlogs);
    // }

    // //if no we need to get from MongoDB,
    // //respond to the request and
    // //update our cache to store the data
    // //TODO: hook up redis to mongoose
    // const blogs = await Blog.findOne({
    //   _user: req.user._id,
    //   _id: req.params.id,
    // });

    // console.log('Serving from MongoDB');
    // res.send(blogs);
    // const stringifiedBlogs = JSON.stringify(blogs);
    // //TODO: set the redis key to expire in 24 hours
    // //TODO: figure out robust solutionfor generating redis keys
    // await client.set(req.params.id, stringifiedBlogs, 'EX', 60 * 60 * 24);
    // //list all the keys in redis
    // //Set the key to expire in 5 seconds
    // await client.set('hi', 'there', 'EX', 5);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    console.log(req.user);
    console.log(req.user._id);
    const blogs = await Blog.find({ _user: req.user._id }).cache();
    //Blog is unique to the user
    //req.user._id is the unique id of the user
    //it may be used as a key for the redis cache
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user._id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.status(400).send(err);
    }
  });
};
