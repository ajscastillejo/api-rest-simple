'use strict'

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose     = require('mongoose');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const app = express();
const port = process.env.PORT || 3000

app.use( bodyParser.urlencoded({ extended: true}))
app.use( bodyParser.json())

mongoose.Promise = Promise;
mongoose
  .connect(process.env.DBURL, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

// Creamos el objeto del esquema y sus atributos
var UserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    id: Number,
    avatar: String
});

app.set('json spaces', 40);

var User = module.exports = mongoose.model('user', UserSchema, "usuarios");
app.get('/users/:id1', (req, res) => {
  var id1 = req.params.id1;
  // asegurate que tengas un usuario con first_name = Eve
  User.findOne({ 'id': id1 }, 'first_name last_name avatar id', function (err, usuario) {
    if (err) return handleError(err);
    
		console.log(usuario.id, usuario.first_name, usuario.last_name, usuario.avatar);
        res.send(usuario);
		
  });
	
})

app.get('/users', (req, res) => {
  // var total = req.params.User;
  User.find(function (err, usuario) {
        res.json(usuario);
		
  });
	
})

app.post('/create', function (req, res) {
  var newUser = new User();
    newUser.first_name = req.body.first_name;
    newUser.last_name = req.body.last_name;
    newUser.id = req.body.id;
    newUser.avatar = req.body.avatar;
    newUser.save(function (err) {
        if (err)  {
          res.json(err);
          res.status(500); 
        }
        res.json({
            message: 'Nuevo usuario creado!!!',
            data: newUser
        });
        res.status(201); 
    });
});

app.delete('/delete/:id1', function (req, res) {
  var id1 = req.params.id1;
  User.findOneAndRemove({ 'id': id1 }, function (err, usuario) {
    if (err) return handleError(err);
  res.status(204);
});
  res.redirect('/users');
});



app.listen(3000, () => {
  console.log(`API REST corriendo en http://localhost:${port}`)
})