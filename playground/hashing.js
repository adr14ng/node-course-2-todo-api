const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (error, salt) => {
  bcrypt.hash(password, salt, (error, hash)=> {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$TejMc.UAe7h97z08xJtOAumZQEMAJbYW409tukE4fyD2rdLjXevUO';

bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded:', decoded);
//
//
// // var iam = 'I am user number 3';
// // var hash = SHA256(iam).toString();
// //
// // console.log(`iam: ${iam}`);
// // console.log(`hash: ${hash}`);
// //
// // var data = {
// //   id: 4
// // };
// //
// // var token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// // }
// //
// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// //
// // var resultHash = SHA256(JSON.stringify((token.data) + 'some secret')).toString();
// //
// // if(resultHash == token.hash) {
// //   console.log('Data was not changed');
// // } else {
// //   console.log(`Data was changed. Do not trust!`);
// // }
