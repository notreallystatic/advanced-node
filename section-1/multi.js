const crypto = require('crypto');

// To check the time for a single execution of pbkdf2.
const start = Date.now();

// A function which performs hashing using the crypto.pbkdf2()
// num = To track which particular function finished execution.
function hash(num) {
  crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', () => {
    console.log(`Hash ${num}: `, Date.now() - start);
  });
}

hash(1);
hash(2);
hash(3);
hash(4);
hash(5);
