const cluster = require('cluster');

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // Cause index.js to be executed again, but in child mode.
  console.log('Master called');
  cluster.fork();
  // cluster.fork();
  // cluster.fork();
  // cluster.fork();
  // cluster.fork();
  // cluster.fork();
} else {
  // I'm a child, am going to act live a server and do nothing else
  console.log('Child process created ', process.env.UV_THREADPOOL_SIZE);
  const express = require('express');
  const app = express();
  const crypto = require('crypto');

  app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send('Hey there!');
    });
  });

  app.get('/fast', (req, res) => {
    res.send('This was fast');
  });

  app.listen(3000);
}
