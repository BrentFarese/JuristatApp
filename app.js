// we've separated out our app and server. `app`
// is responsible for coodrinating routes and middleware.
// server is responsible for serving the app defined
// in this file.

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const applicationRouter = require('./routes/applications');

const documentRouter = require('./routes/documents');

const matterRouter = require('./routes/matters');

const taskRouter = require('./routes/tasks')

const usersRouter = require('./routes/users');

const allowanceRatesRouter = require('./routes/juristatAPI/allowance_rates');

const avgOfficeActionsRouter = require('./routes/juristatAPI/avg_office_actions');

const applicationDataRouter = require('./routes/juristatAPI/application_data');

const examinerDataRouter = require('./routes/juristatAPI/examiner_data');


// Set up the express app
const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use('/applications', cors(), applicationRouter);

app.use('/documents', cors(), documentRouter);

app.use('/matters', cors(), matterRouter);

app.use('/tasks', cors(), taskRouter);

app.use('/users', cors(), usersRouter);

app.use('/allowance-rates', cors(), allowanceRatesRouter);

app.use('/avg-office-actions', cors(), avgOfficeActionsRouter);

app.use('/application-data', cors(), applicationDataRouter);

app.use('/examiner-data', cors(), examinerDataRouter);


app.use('*', (req, res) => {
  res.status(404).json({message: 'Not Found'});
});

module.exports = app;