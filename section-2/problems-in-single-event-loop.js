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
