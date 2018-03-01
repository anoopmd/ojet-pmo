const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const cors = require('cors');

const NeDB = require('nedb');
const service = require('feathers-nedb');

const db = new NeDB({
  filename: './db-data/messages',
  autoload: true
});

// Create an Express compatible Feathers application instance.
const app = express(feathers());

// Turn on JSON parser for REST services
app.use(express.json());

// Turn on CORS
app.use(cors());

// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({extended: true}));

// Enable REST services
app.configure(express.rest());

// Connect to the db, create and register a Feathers service.
app.use('/api/users', service({
  Model: db,
  id: 'id',
  paginate: {
    default: 5,
    max: 100
  }
}));

// Event Handlers
let userService = app.service('api/users');;
userService.on('created', (user, context) => console.log('created', user));
userService.on('updated', (user, context) => console.log('updated', user));
userService.on('removed', (user, context) => console.log('removed', user));

// Set up default error handler
app.use(express.errorHandler());

// Start the server.
const port = 5000;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});
