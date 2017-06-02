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

function generateFakeUser() {
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

function generateFakeApplication() {
	const fakeApplication = {
		serialNumber: faker.random.uuid(),
		title: faker.random.words()
	};
	return fakeApplication;
};

function generateFakeMatter() {
	const fakeMatter = {
		firmReference: faker.random.uuid(),
		clientReference: faker.random.uuid(),
		legalType: faker.random.word(),
		importanceLevel: fake.random.number()
	};
	return fakeMatter;
};

function generateFakeDocument() {
	const fakeDocument = {
		documentType: faker.random.word(),
		url: faker.internet.url()
	};

};

function generateFakeTask() {
	const fakeTask = {
		completed: faker.random.boolean(),
		taskDescription: faker.lorem.words(),
		dueDate: faker.date.future()
	};
	return fakeTask;
};

function createTables() {
	let userId, documentId, applicationId, taskId
	User.create(generateFakeUser())
	.then(user => {
		userId = user.id;
		Matter.create(generateFakeMatter());
	})
	.then(matter => {
		matterId = matter.id;
		Document.create(generateFakeDocument());
	})
	.then(document => {
		documentId = document.id;
		Application.create(generateFakeApplication());
	})
	.then(application => {
		applicationId = application.id;
		Task.create(generateFakeTask());
	})
	.then(task => {
		taskId = task.id;
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
	})
};

function seedDatabase(num) {

};