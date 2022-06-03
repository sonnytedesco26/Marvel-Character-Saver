const { Schema } = require('mongoose');

const characterSchema = new Schema({
  characterId: {
    type: Number,
    required: true
  },
  apiId: {
    type: String,
    required: true
  }
});

module.exports = characterSchema;
