const request = require('supertest');
const expect = require('expect');

const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should POST todos', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should NOT create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch ((e) => done(e));
    });

  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {

    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
    .end(done);
  });

  it('Should not return todo doc created by other user', (done) => {

    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexID = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {

    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end((error, res) => {
        if (error){
          return done(error);
        }

      Todo.findById(hexID).then((todo) => {
        expect(todo).toBe(null);
        done();
      }).catch((error) => done(error));
      });
  });

  it('Should NOT remove a todo', (done) => {
    var hexID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((error, res) => {
        if (error){
          return done(error);
        }

      Todo.findById(hexID).then((todo) => {
        expect(todo).not.toBe(null);
        done();
      }).catch((error) => done(error));
      });
  });

  it('Should return 404 if todo not found', (done) => {
    var hexID = new ObjectID().toHexString;

    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
    .end(done);
  });

  it('Should return 404 if ObjectID is invalid', (done) => {
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    var hexID = todos[0]._id.toHexString();
    var text = 'Test todo text';


    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        text,
        completed: true
      })
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end((error, res) => {
        if (error){
          return done(error);
        }

      Todo.findById(hexID).then((todo) => {
        expect(todo).not.toBe(null);
        done();
      }).catch((error) => done(error));
      });
  });

  it('Should NOT update the todo', (done) => {
    var hexID = todos[1]._id.toHexString();
    var text = 'Test todo text';


    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        text,
        completed: true
      })
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((error, res) => {
        if (error){
          return done(error);
        }

      Todo.findById(hexID).then((todo) => {
        expect(todo).not.toBe(null);
        done();
      }).catch((error) => done(error));
      });
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    //grab ID of second todo item
    //update text, set completed to false
    //200
    //text is changed, completed is false, completedAt is null, .toNotExist
    var hexID = todos[1]._id.toHexString();
    var text = 'Blah blah blah';

    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        text,
        completed: false
      })
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
    .end(done);
  });

  it('Should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
    .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    var email = 'adrian@adrian.com';
    var password = 'passwordOne!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((error) => {
        if(error){
          return done(error);
        }
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((error) => done(error));
      });
  });

  it('Should return validation errors if request invalid', (done) => {
    var email = 'adriango.com';
    var password = 'passwordOne!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('Should not create user if email in use', (done) => {
    var email = 'adrian@go.com';
    var password = 'passwordOne!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {
    var email = users[1].email;
    var password = users[1].password;

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
    .end((error, res) => {
      if(error){
        return done(error);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[1].access).toBe('auth');
        expect(user.tokens[1].token).toBe(res.headers['x-auth']);
        done();
    }).catch((error) => done(error));
  });
});

  it('Should reject invalid login', (done) => {
    var email = users[1].email;
    var password = 'beavis';

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((error, res) => {
        if(error){
          return done(error);
        }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((error) => done(error));
    });
  });

});

describe('DELETE /users/me/token', () => {

  it('Should remove Auth token on logout', (done) => {

    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
    .end((error, res) => {
      if(error){
        return done(error);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((error) => done(error));
    });
  });

});
