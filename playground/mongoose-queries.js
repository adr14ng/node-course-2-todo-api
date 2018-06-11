const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// var todo_id = '5b1aaf078144a8430895f48d';
//
// if(!ObjectID.isValid(todo_id)){
//   console.log(`ObjectID is not valid!`);
// }

var user_id = '5b180ca17494f00b6890e4ad';

User.findById(user_id).then((user) => {
  if(!user){
    return console.log(`User by ID not found!`);
  }

  console.log(`User found by ID: ${user}`)
}, (error) => {
  console.log(error);
});



// Todo.find({
//   _id: todo_id
// }).then((todos) => {
//   console.log(`All Todos finding by ID: ${todos}`);
// });
//
// Todo.findOne({
//   _id: todo_id
// }).then((todo) => {
//   console.log(`Todo find One: ${todo}`);
// });

// Todo.findById(todo_id).then((todo) => {
//   if(!todo){
//     return console.log(`ID not found!`);
//   }
//   console.log(`Todo by ID: ${todo}`);
// }).catch((error) => {
//   console.log(error);
// });
