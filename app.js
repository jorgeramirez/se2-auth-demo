const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// helth check
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

module.exports = app;
