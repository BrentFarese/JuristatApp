const faker = require('faker');

const {PORT} = require('../config');
const {runServer, closeServer} = require('../server');
const {sequelize} = require('../db/sequelize');
const {db} = require('../models');

before(function() {
	return sequelize
	.sync({force: true, match: /_test$/ })
	.then(() => runServer(PORT));
});

after(function() {
	return closeServer();
});

const fakeUser = () => {
	return {
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
	}
};

const fakeApplication = (userId, matterId) => {
	return {
		serialNumber: faker.random.number(),
		title: faker.random.words(),
		userId: userId,
		matterId: matterId
	}
};

const fakeMatter =  (userId) => {
	return {
		firmReference: faker.random.alphaNumeric(),
		clientReference: faker.random.alphaNumeric(),
		legalType: faker.random.word(),
		importanceLevel: faker.random.number(),
		userId: userId
	}
};

const fakeDocument = (applicationId) => {
	return {
		documentType: faker.random.word(),
		url: faker.internet.url(),
		applicationId: applicationId
	}
};

const fakeTask = (userId, applicationId, matterId) => {
	return {
		completed: faker.random.boolean(),
		taskDescription: faker.lorem.words(),
		dueDate: faker.date.future(),
		userId: userId,
		applicationId: applicationId,
		matterId: matterId
	}
};

function createRecords() {
	let user;
	let document;
	let application;
	let task;
	let matter;
	console.log(fakeUser());
	db.User.create(fakeUser())
	//Adding a fakeMatter, needs keys userId.
	.then(_user => {
		user = _user;
		console.log(`This is the userId ${user.id} \n\n`);
		return db.Matter.create(fakeMatter(user.id))
		// Adding a fakeApplication with userId and matterId.
		.then(_matter => {
			matter = _matter;
			console.log(`This is the matter ${JSON.stringify(matter)} \n\n\n`);
			return db.Application.create(fakeApplication(user.id, matter.id))
			//Adding a document with applicationId.
			.then(_application => {
				application = _application;
				console.log(`This is the application ${JSON.stringify(application)} \n\n\n`);
				user.addApplications([application]);
				return db.Document.create(fakeDocument(application.id))
				//Adding a task with userId, applicationId, and matterId.
				.then(_document => {
					document = _document;
					console.log(`This is the document ${JSON.stringify(document)} \n\n\n`);
					return db.Task.create(fakeTask(user.id, application.id, matter.id))
					.then(_task => {
						task = _task;
						console.log(`This is the task ${JSON.stringify(task)} \n\n\n`);
					})
				})
			})
		})
	})
};

function seedDatabase(num) {
	for (let i=0; i<num; i++) {
		createRecords();
	};
};

function dropRecords() {
	return Promise.all([
		db.UserApplication.truncate({cascade: true}),
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