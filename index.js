var cors = require("cors");
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


// Set view engine
app.set('view engine', 'ejs');

// Middleware for serving static files
app.use(express.static('public'));
app.use('/uploads', express.static("uploads"));

// Configure CORS
app.use(cors());


// Body parser configuration for JSON and URL-encoded requests (non-file uploads)

app.use(bodyParser.json({ limit: '20gb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20gb' }));

app.use(express.json({ limit: '20gb' })); // Set JSON body limit to 20GB
app.use(express.urlencoded({ extended: true, limit: '20gb' }));


const connectDB = require('./config/config');
// Connect to MongoDB
connectDB();

// route setup
const route = require('./routes/route')
app.use('/', route);
app.use('/api', route);

app.use(cors());
// route setup
// Set a timeout for all requests
// Increase request and response timeouts to 30 minutes (for long-running requests)
app.use((req, res, next) => {
  req.setTimeout(30 * 60 * 1000); // 30 minutes timeout for requests
  res.setTimeout(30 * 60 * 1000); // 30 minutes timeout for responses
  next();
});
  // Example route to fetch all users
app.listen(1234, () => {
    console.log("Server Initiated...");
});

