const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const passport = require('passport');

const googleAuth = require('./google-auth');

const API_BASE_URL = '/api/v1';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  googleAuth(app);
}

// health check (public endpoint)
app.get('/', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

// private endpoint
app.get(
  `${API_BASE_URL}/me`,
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.json({ ...req.user });
  }
);

module.exports = app;
