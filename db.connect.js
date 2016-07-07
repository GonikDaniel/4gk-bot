const mongoose   = require('mongoose');
const MONGO_URI = process.env.NODE_ENV !== 'local' ?
                  process.env.MONGOLAB_URI :
                  'mongodb://localhost/test';

module.exports.connect = function() {
  mongoose.connect(MONGO_URI, e => {
    e ? console.error(e) : console.log('mongo connected');
  });
};