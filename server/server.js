require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate')

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//POST TODOS
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  });
});
//---

//GET TODOS
app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos});
  }, (error) => {
    res.status(400).send(error);
  });
});
//---

//GET TODOS/:id
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({
    _creator: req.user._id,
    _id: id
  }).then((todo) => {
      if(!todo){
        return res.status(404).send();
      }
        res.send({todo});
    }).catch((error) => {
        res.status(400).send();
    });
});
//---

//DELETE TODOS/:id
app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _creator: req.user._id,
    _id: id
  }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
      res.send({todo});
  }).catch((error) => {
    res.status(400).send();
  });
});
//---

//PATCH TODOS/:id
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _creator: req.user._id,
    _id: id
  }, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((error) => {
    res.status(404).send();
  })

});
//---

//POST USER
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((error) => {
    console.log(error);
    res.status(400).send(error);
  })
});
//--

//GET USER
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});
//---

//POST users/login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((error) => {
    res.status(400).send();
  });
});

//DELETE users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Server starting on Port: ${port}`);
});

module.exports = {app};
