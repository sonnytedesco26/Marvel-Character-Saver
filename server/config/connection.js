const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_ENDPOINT || 'mongodb://127.0.0.1:27017/marvelCharacterDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,  
});

module.exports = mongoose.connection;
