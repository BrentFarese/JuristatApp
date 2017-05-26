// we've separated out our app and server. `app`
// is responsible for coodrinating routes and middleware.
// server is responsible for serving the app defined
// in this file.

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const applicationRouter = require('./routes/applications');

const documentRouter = require('./routes/documents');

const matterRouter = require('./routes/matters');

const taskRouter = require('./routes/tasks')

const usersRouter = require('./routes/users');

// Set up the express app
const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use('/applications', applicationRouter);

app.use('/documents', documentRouter);

app.use('/matters', matterRouter);

app.use('/tasks', taskRouter);

app.use('/users', usersRouter);

app.use('*', (req, res) => {
  res.status(404).json({message: 'Not Found'});
});

module.exports = app;