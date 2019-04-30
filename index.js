'use strict'

require('dotenv').config({ path: './' });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose     = require('mongoose');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 3000

app.use(cors({
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: 'http://localhost:4200',
  preflightContinue: false
}));

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
  id: Number,
  first_name: String,
  last_name: String,
  avatar: String,
});

app.set('json spaces', 40);

var User = module.exports = mongoose.model('user', UserSchema, "usuarios");
app.get('/users/:id1', (req, res) => {
  var id1 = req.params.id1;
  // if (id1 !=  ) {
  //   res.send('404 NOT FOUND')
  // }
  // else if (id1 != usuario) {
  //   res.send('USER ID NOT FOUND')
  // }

  User.findOne({ 'id': id1 }, 'id first_name last_name avatar', function (err, usuario) {
    if (err) return handleError(err);
    console.log("usuario", usuario)
		// console.log(usuario.id, usuario.first_name, usuario.last_name, usuario.avatar);
    res.send(usuario);
		
  });
	
})

// User.find().count() 

app.get('/users', (req, res) => {
  var page = parseInt(req.query.page);
  var per_page = parseInt(req.query.per_page);
  User.count({}, function( err, count){
    var total_page = parseInt(count / per_page);

   if (count / per_page < page) {
    page = Math.ceil(count / per_page) ;
  }

    User.find(function (err, usuario) {
      console.log( "Number of users:", count );
      var respuesta = {
        'total': count,
        'per_page': per_page,
        'page': page,
        'total_page': total_page,
        data: usuario,
      };
      res.json(respuesta);
    }).skip( page > 0 ? ( ( page - 1 ) * per_page ) : 0 )
    .limit( per_page )
    .sort({id: 1})
  });
})

app.post('/users', function (req, res) {
  var newUser = {
    'id' : req.body.id,
    'first_name' : req.body.first_name,
    'last_name' : req.body.last_name,
    'avatar' : req.body.avatar,
    '_id': req.body._id,
    '__v': req.body.__v,
    };
    User.create(newUser, function (err, ok) {
        if (err)  {
          res.json(err);
          res.status(500); 
        }
        res.json({
            message: 'Nuevo usuario creado!!!',
            data: ok
        });
        res.status(201); 
    });
});

app.delete('/users/:id1', function (req, res) {
  var id1 = req.params.id1;
  User.findOneAndRemove({ 'id': id1 }, function (err) {
    if (err) return handleError(err);
  res.status(204);
});
});

app.put('/users/:id1', function (req, res) {
  var id1 = req.params.id1;
  User.findOne({'id':id1}, function (err, usuario) {
    if (err)
    res.send(err);
console.log(req.paramsx)
usuario.first_name = req.body.first_name; 
usuario.last_name = req.body.last_name; 
usuario.avatar = req.body.avatar;

usuario.save(function(err) {
    if (err)
        res.send(err);

    res.json({ message: 'User updated!' });
});
});
});



app.listen(3000, () => {
  console.log(`API REST corriendo en http://localhost:${port}`)
})
