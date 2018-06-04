//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);


// var user = {name: 'Adrian', age: 25};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Eat lunch',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable able to insert in todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Adrian',
  //   age: 25,
  //   location: 'Los Angeles'
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable able to insert in todo', err);
  //   }
  //
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  client.close();
});
