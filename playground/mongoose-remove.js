const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//Todo.remove
//Removes all todos
  // Todo.remove({}).then((result) => {
  //   console.log(result);
  // });

//Todo.findOneAndRemove
//Remove One
  // Todo.findOneAndRemove({
  //   text: 'Something todo'
  // }).then((todo) => {
  //   console.log(todo);
  // });

//Todo.findByIdAndRemove
//find and remove by ID
  // Todo.findByIdAndRemove('5b208a8cb1b50bd708ec0f28').then((todo) => {
  //   console.log(todo);
  // });
