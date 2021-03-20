const express = require('express');
const crypto = require('crypto');
const app = express();
const Worker = require('webworker-threads').Worker;

app.get('/', (req, res) => {
  // Worker interface
  const worker = new Worker(function () {
    this.onmessage = function () {
      // Computationally expensive expression here.
      let count = 0;
      while (count < 1e9) {
        count++;
      }

      postMessage(count);
    };
  });

  worker.onmessage = function (message) {
    console.log(message.data);
    res.send('' + message.data);
  };

  worker.postMessage();
});

app.get('/fast', (req, res) => {
  res.send('This was fast');
});

app.listen(3000);
