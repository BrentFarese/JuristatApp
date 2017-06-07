'use strict';


// this module is responsible for two things:
// 1. calling the `.associate` method on all our models
// 2. exporting our models (after they've been assoiated)
//
// Any code that needs access to our models (so `app.js`
// and our tests) should import the models from this file,
// not from the individual models files. If you import
// models from the individual file, they won't have had
// `.associate` called on them.

// Any time you create a new model for an app, import it here
const {Application} = require('../models/application'); 
const {Document} = require('../models/document');
const {Matter} = require('../models/matter');
const {Task} = require('../models/task');
const {User} = require('../models/user');
const {UserApplication} = require('../models/user_application');

// All models you want to expose to other modules should go here
const db = {
	Application,
	Document,
	Matter,
	Task,
	User, 
	UserApplication
};

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

// the outside world should only get access to our models
// via this single `db` object.
module.exports = {
	db
};