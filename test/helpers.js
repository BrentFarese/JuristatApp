const faker = require('faker');

const {PORT} = require('../config');
const {runServer, closeServer} = require('../server');
const {sequelize} = require('../db/sequelize');
const {Application} = require('../models/application'); 
const {Document} = require('../models/document');
const {Matter} = require('../models/matter');
const {Task} = require('../models/task');
const {User} = require('../models/user');

before(function() {
	return sequelize
	.sync({force: true})
	.then(() => runServer(PORT));
});

after(function() {
	return closeServer();
});

function generateFakeUser() {
	const fakeUser = {
		id: faker.random.uuid(),
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
	return fakeUser;
};

function generateFakeApplication() {
	const fakeApplication = {
		id: faker.random.uuid(),
		serialNumber: faker.random.number(),
		title: faker.random.words()
	};
	return fakeApplication;
};

function generateFakeMatter() {
	const fakeMatter = {
		id: faker.random.uuid(),
		firmReference: faker.random.alphaNumeric(),
		clientReference: faker.random.alphaNumeric(),
		legalType: faker.random.word(),
		importanceLevel: faker.random.number()
	};
	return fakeMatter;
};

function generateFakeDocument() {
	const fakeDocument = {
		id: faker.random.uuid(),
		documentType: faker.random.word(),
		url: faker.internet.url()
	};
	return fakeDocument;
};

function generateFakeTask() {
	const fakeTask = {
		id: faker.random.uuid(),
		completed: faker.random.boolean(),
		taskDescription: faker.lorem.words(),
		dueDate: faker.date.future()
	};
	return fakeTask;
};

function createRecords() {
	let userId;
	let documentId;
	let applicationId;
	let taskId;
	let matterId;
	return User.create(generateFakeUser())
	.then(user => {
		userId = user.id;
		return Matter.create(generateFakeMatter());
	})
	.then(matter => {
		matterId = matter.id;
		return Document.create(generateFakeDocument());
	})
	.then(document => {
		documentId = document.id;
		return Application.create(generateFakeApplication());
	})
	.then(application => {
		applicationId = application.id;
		return Task.create(generateFakeTask());
	})
	.then(task => {
		taskId = task.id;
		console.log(userId, documentId, applicationId, taskId, matterId);
		User.upsert({
			applicationId: applicationId,
			matterId: matterId,
			taskId: taskId
		});
		Matter.upsert({
			userId: userId,
			documentId: documentId,
			applicationId: applicationId,
			taskId: taskId
		});
		Document.upsert({
			applicationId: applicationId,
			taskId: taskId,
			matterId: matterId
		});
		Application.upsert({
			matterId: matterId,
			userId: userId,
			documentId: documentId,
			taskId: taskId
		});
		Task.upsert({
			matterId: matterId,
			userId: userId,
			documentId: documentId,
			taskId: taskId
		});
	});
};

function seedDatabase(num) {
	for (let i=0; i<num; i++) {
		createRecords();
	};
};

function dropRecords() {
	return Promise.all([
		User.truncate({cascade: true}),
		Application.truncate({cascade: true}),
		Matter.truncate({cascade: true}),
		Task.truncate({cascade: true}),
		Document.truncate({cascade: true})
		]);
};

module.exports = {
	seedDatabase,
	dropRecords
};