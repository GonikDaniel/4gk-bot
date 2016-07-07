const mongoose   = require('mongoose');

// Mongoose Schema definition
const Schema = new mongoose.Schema({
  id       : String, 
  question : String,
  answer   : String,
  date     : Date,
  likes    : Number
});

const Question = mongoose.model('Question', Schema);

module.exports = Question;