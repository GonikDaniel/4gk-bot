// https://devcenter.heroku.com/articles/mongolab
const express    = require('express');
const Question   = require('./models/questions.js');
const bodyParser = require('body-parser');
const DB         = require('./db.connect.js');

DB.connect();


express()
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

  .get('/api', function (req, res) {
    res.json(200, { msg: 'OK' });
  })

  .get('/api/questions', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Question.find( function ( err, questions ){
      res.json(200, questions);
    });
  })

  .post('/api/questions', function (req, res) {
    const question = new Question( req.body );
    question.id = question._id;
    // http://mongoosejs.com/docs/api.html#model_Model-save
    question.save(function (err) {
      res.json(200, question);
    });
  })

  .del('/api/questions', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    Question.remove({ completed: true }, function ( err ) {
      res.json(200, { msg: 'OK' });
    });
  })

  .get('/api/questions/random', function (req, res) {
    Question.count().exec((err, count) => {

      const random = Math.floor(Math.random() * count);

      Question.findOne().skip(random).exec((err, question) => {
        res.json(200, question);
      });

    });
  })

  .get('/api/questions/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Question.findById( req.params.id, function ( err, question ) {
      res.json(200, question);
    });
  })

  .put('/api/questions/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Question.findById( req.params.id, function ( err, question ) {
      question.title = req.body.title;
      question.completed = req.body.completed;
      // http://mongoosejs.com/docs/api.html#model_Model-save
      question.save( function ( err, question ){
        res.json(200, question);
      });
    });
  })

  .del('/api/questions/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Question.findById( req.params.id, function ( err, question ) {
      // http://mongoosejs.com/docs/api.html#model_Model.remove
      question.remove( function ( err, question ){
        res.json(200, { msg: 'OK' });
      });
    });
  })

  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000);
