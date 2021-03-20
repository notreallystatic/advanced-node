const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = (app) => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const redis = require('redis');
    const redisUrl = 'redis://127.0.0.1:6379';
    const client = redis.createClient(redisUrl);

    // util library is present inside node to provide some utilities.
    // util.promisify is a function which accepts a function reference which accepts a callback as the last argument
    // and changes it to a function which return a promise.
    const util = require('util');
    client.get = util.promisify(client.get);

    // Get the blogs stored in our cache server
    const cachedBlogs = await client.get(req.user.id);

    // If blog is present, return
    if (cachedBlogs) {
      console.log('Serving from Cache');
      return res.send(JSON.parse(cachedBlogs));
    }
    // else, fetch it from DB, return it & save it in our cache server

    const blogs = await Blog.find({ _user: req.user.id });
    console.log('serving from mongodb');
    res.send(blogs);
    client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
