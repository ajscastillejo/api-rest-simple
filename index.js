'use strict'

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose     = require('mongoose');

const app = express();
const port = process.env.PORT || 3000

app.use( bodyParser.urlencoded({ extended: false}))
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

var User = module.exports = mongoose.model('user', UserSchema, "usuarios");

app.get('/users', (req, res) => {
  	// asegurate que tengas un usuario con first_name = Eve
    User.findOne({ 'first_name': 'Eve' }, 'first_name last_name avatar id', function (err, usuario) {
		if (err) return handleError(err);
  		
		console.log(usuario.first_name, usuario.last_name, usuario.avatar, usuario.id);
        res.send( 'hola ' + usuario.first_name);
		
	});
	
})



app.listen(3000, () => {
  console.log(`API REST corriendo en http://localhost:${port}`)
})