const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  });
});

app.listen(3000, () => {
  console.log('Server starting on Port:3000');
});




// var newTodo = new Todo({
//   text: 'Cook Dinner'
// });

// newTodo.save().then((doc) => {
//   console.log('Saved Todo: ', doc);
// }, (err) => {
//   console.log('Unable to save todo');
// });

// var newUser = new User({
//   email: 'bobbutthead@butthead.com'
// });
//
// newUser.save().then((doc) => {
//   console.log(`Success saving: ${JSON.stringify(doc, undefined, 2)}`);
// }, (error) => {
//   console.log(`There was an error saving: ${error}`)
// });

// newTodo.save().then((doc) => {
//   console.log(`Success saving: ${doc}`);
// }, (error) => {
//   console.log(`There was an error saving: ${error}`);
// });
