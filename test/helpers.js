const faker = require('faker');

const {PORT} = require('../config');
const {runServer, closeServer} = require('../server');
const {sequelize} = require('../db/sequelize');
const {Application, Document, Matter, Task, User} = require('../models');

before(function() {
	return sequelize
	.sync({force: true})
	.then(() => runServer(PORT));
});

after(function() {
	return closeServer();
});

function generateFakeUser(applicationId, matterId, taskId) {
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
	return fakeUser;
};

function generateFakeApplication(userId, documentId, matterId, taskId) {
	const fakeApplication = {
		serialNumber: faker.random.uuid(),
		title: faker.random.words()
	};
	if (userId) {
		fakeApplication.userId = userId;
	}
	if (documentId) {
		fakeApplication.documentId = documentId;
	}
	if (matterId) {
		fakeApplication.matterId = matterId;
	}
	if (taskId) {
		fakeApplication.taskId = taskId;
	}
	return fakeApplication;
};

function generateFakeMatter(userId, documentId, applicationId, taskId) {
	const fakeMatter = {
		firmReference: faker.random.uuid(),
		clientReference: faker.random.uuid(),
		legalType: faker.random.word(),
		importanceLevel: fake.random.number()
	};
	return fakeMatter;
};

function generateFakeDocument(applicationId, matterId, taskId) {
	const fakeDocument = {
		documentType: faker.random.word(),
		url: faker.internet.url()
	};

};

function generateFakeTask(userId, documentId, matterId, taskId) {
	const fakeTask = {
		completed: faker.random.boolean(),
		taskDescription: faker.lorem.words(),
		dueDate: faker.date.future()
	};
	return fakeTask;
};

function createTables() {
	User.create(generateFakeUser())
	.then(user => {
		Task.create(generateFakeTask(user.id));
		Matter.create(generateFakeMatter(user.id));
		Application.create(generateFakeApplication(user.id));
	})
	.then(matter => {
		User.upsert({matterId: matter.id});
		Task.upsert({matterId: matter.id});
		Application.upsert({matterId: matter.id});
		Document.create(generateFakeDocument(matter.id));
	})
	.then((task, document, application) => {
		
	})
};

function seedDatabase(num) {

};