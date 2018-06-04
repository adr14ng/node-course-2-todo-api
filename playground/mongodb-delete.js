//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  //delete many
  // db.collection('Todos').deleteMany({
  //   text: 'Eat lunch'
  // }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({
  //   name: 'Adrian'
  // }).then((result) => {
  //   console.log(result);
  // });

  //delete one
  // db.collection('Todos').deleteOne({
  //   text: 'Eat lunch'
  // }).then((result) => {
  //   console.log(result);
  // });

  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({
  //   completed: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').findOneAndDelete({
  //   _id: new ObjectID("5b15ba9ce6de7611d01efbd6")
  // }).then((result) => {
  //   console.log(JSON.stringify(result, undefined, 2));
  // });


  client.close();
});
