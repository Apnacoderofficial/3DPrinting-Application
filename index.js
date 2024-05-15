var cors = require("cors");
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');
const crypto = require('crypto');

const app = express();
app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false
}));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
// Set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

const connectDB = require('./config/config');
// Connect to MongoDB
connectDB();

// route setup
const route = require('./routes/route')
app.use('/', route);
app.use('/api', route);

app.use(cors());
// route setup

  // Example route to fetch all users
app.listen(1234, () => {
    console.log("Backend Server Started At 3000 port");
});

