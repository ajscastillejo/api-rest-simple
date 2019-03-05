'use strict'

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose     = require('mongoose');

const app = express();
const port = process.env.PORT || 3000

app.use( bodyParser.urlencoded({ extended: false}))
app.use( bodyParser.json())

app.get('/users', (req, res) => {
  res.send( 'hola!')
})

mongoose.Promise = Promise;
mongoose
  .connect(process.env.DBURL, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

app.listen(3000, () => {
  console.log(`API REST corriendo en http://localhost:${port}`)
})