const { Schema } = require('mongoose');

const characterSchema = new Schema({
  characterId: {
    type: Number,
    required: true
  },
  characterName: {
    type: String,
    required: true
  },
  characterDescription: {
    type: String
  },
  characterImagePath: {
    type: String
  },
  characterImageExt: {
    type: String
  }
});

module.exports = characterSchema;
