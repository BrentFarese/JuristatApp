const faker = require('faker');

const {PORT} = require('../config');
const {runServer, closeServer} = require('../server');
const {sequelize} = require('../db/sequelize');
const {db} = require('../models');

before(function() {
	return sequelize
	.sync({force: true})
	.then(() => runServer(PORT));
});

after(function() {
	return closeServer();
});

const fakeUser = {
	userName: faker.internet.userName(),
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	password: faker.random.word(),
	email: faker.internet.email(),
	streetAddress: faker.address.streetAddress(),
	state: faker.address.state(),
	postalCode: faker.address.zipCode(),
	country: faker.address.country(),
	userType: faker.internet.userAgent()
};

const fakeApplication = {
	serialNumber: faker.random.number(),
	title: faker.random.words()
};

const fakeMatter = {
	firmReference: faker.random.alphaNumeric(),
	clientReference: faker.random.alphaNumeric(),
	legalType: faker.random.word(),
	importanceLevel: faker.random.number()
};

const fakeDocument = {
	documentType: faker.random.word(),
	url: faker.internet.url()
};

const fakeTask = {
	completed: faker.random.boolean(),
	taskDescription: faker.lorem.words(),
	dueDate: faker.date.future()
};

function createRecords() {
	let user;
	let document;
	let application;
	let task;
	let matter;
	db.User.create(fakeUser)
	//Adding a fakeMatter, needs keys userId.
	.then(_user => {
		user = _user;
		fakeMatter.userId = user.id;
		return db.Matter.create(fakeMatter);
	})
	//Adding a fakeApplication with userId and matterId.
	.then(_matter => {
		matter = _matter;
		fakeApplication.userId = user.id;
		fakeApplication.matterId = matter.id;
		return db.Application.create(fakeApplication);
	})
	//Adding a document with applicationId.
	.then(_application => {
		application = _application;
		user.addApplication([application]);
		fakeDocument.applicationId = application.id;
		return db.Document.create(fakeDocument);
	})
	//Adding a task with userId, applicationId, and matterId.
	.then(_document => {
		document = _document;
		fakeTask.userId = user.id;
		fakeTask.applicationId = application.id;
		fakeTask.matterId = matter.id;
		return db.Task.create(fakeTask);
	})
};

function seedDatabase(num) {
	for (let i=0; i<num; i++) {
		createRecords();
	};
};

function dropRecords() {
	return Promise.all([
		db.User.truncate({cascade: true}),
		db.Application.truncate({cascade: true}),
		db.Matter.truncate({cascade: true}),
		db.Task.truncate({cascade: true}),
		db.Document.truncate({cascade: true})
		]);
};

module.exports = {
	seedDatabase,
	dropRecords
};