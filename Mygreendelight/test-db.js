const fs = require('fs');
const mongoose = require('mongoose');

const envFile = fs.readFileSync('.env.local', 'utf8');
let uri = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('MONGODB_URI=')) {
    // Correctly split at the FIRST equals sign
    uri = line.substring(line.indexOf('=') + 1).trim().replace(/^"|"$/g, '');
  }
});

console.log('Connecting to:', uri.replace(/:([^:@]{8})[^:@]*@/, ':****@'));

mongoose.connect(uri)
  .then(() => {
    console.log('Connection successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
