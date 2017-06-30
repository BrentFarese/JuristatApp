const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = chai.should();
const app = require('../app');

const {db} = require('../models');

const {seedDatabase} = require('./helpers');
const {dropRecords} = require('./helpers');


chai.use(chaiHttp);

describe('users routes', function() {
	
	beforeEach(function() {
		return dropRecords()
		.then(function() {
			return seedDatabase(2);
		});
	});	
	
	describe('GET /users/:id', function() {
		it('should return user by ID', function() {
			let user;
			return db.User.findOne()
			.then(function(_user) {
				user = _user;
				return chai.request(app)
				.get(`/users/${user.id}`); 
			})
			.then(function(res) {
				res.should.have.status(200);
				res.body.id.should.equal(user.id);
				res.body.userName.should.equal(user.userName);
				res.body.firstName.should.equal(user.firstName);
				res.body.lastName.should.equal(user.lastName);
				res.body.password.should.equal(user.password);
				res.body.email.should.equal(user.email);
				res.body.streetAddress.should.equal(user.streetAddress);
				res.body.state.should.equal(user.state);
				res.body.postalCode.should.equal(user.postalCode);
				res.body.country.should.equal(user.country);
				res.body.userType.should.equal(user.userType);
			});
		});
	});

	describe('GET /users/:id/applications', function() {
		it('should return all applications for a user', function () {
			let user;
			return db.User.findOne({
				include: [{
					model: db.Application,
					as: 'applications'
				}]
			})
			.then(_user => {
				user = _user;
				return chai.request(app)
				.get(`/users/${user.id}/applications`);
			})
			.then(res => {
				res.should.have.status(200);
				res.body.applications.forEach(application => {
					application.should.be.a('object');
					application.should.include.keys('id', 'serialNumber', 'title');
				});
				user.applications.map(application => application.id).should.deep.equal(res.body.applications.map(application => application.id));
			});
		});
	});

	describe('GET /users/:id/matters', function() {
		it('should return all matters for a user', function () {
			let user;
			return db.User.findOne({
				include: [{
					model: db.Matter,
					as: 'matters'
				}]
			})
			.then(_user => {
				user = _user;
				return chai.request(app)
				.get(`/users/${user.id}/matters`);
			})
			.then(res => {
				res.should.have.status(200);
				res.body.matters.forEach(matter => {
					matter.should.be.a('object');
					matter.should.include.keys('id', 'firmReference', 'clientReference', 'legalType', 'importanceLevel');
				});
				user.matters.map(matter => matter.id).should.deep.equal(res.body.matters.map(matter => matter.id));
			});
		});
	});

	// describe('GET /users/:id/tasks', function() {
	// 	it('should return all tasks for a user', function() {
	// 		return User.findOne({
	// 			include: [{
	// 				model: Task,
	// 				through: 'UserTask'
	// 			}]
	// 		})
	// 		.then(user => {
	// 			return chai.request(app)
	// 			.get(`/users/${this.user.id}/matters`);
	// 		})
	// 		.then(res => {
	// 			res.should.have.status(200);
	// 			res.body.id.should.equal(this.user.id);
	// 			res.body.tasks.forEach(task => {
	// 				task.should.be.a('object');
	// 				task.should.include.keys('id', 'createdAt', 'updatedAt', 'taskDescription', 'completed', 'dueDate');
	// 			});
	// 			this.user.tasks.map(task => task.id).should.deep.equal(res.body.tasks.map(task => task.id));
	// 		});
	// 	});
	// });

	describe('POST /', function() {
		it('should add a user', function() {
			const newUser = {
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

			return chai.request(app).post('/users').send(newUser);

			return db.User.findById(newUser.id)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.should.be.a('object');
				res.should.include.keys('id', 'createdAt', 'updatedAt', 'userName', 'firstName', 'lastName', 'password', 'email', 'streetAddress', 'state', 'postalCode', 'country', 'userType');
				res.body.id.should.not.be.null;
				res.body.id.should.equal(newUser.id);
				res.body.userName.should.equal(newUser.userName);
				res.body.firstName.should.equal(newUser.firstName);
				res.body.lastName.should.equal(newUser.lastName);
				res.body.password.should.equal(newUser.password);
				res.body.email.should.equal(newUser.email);
				res.body.streetAddress.should.equal(newUser.streetAddress);
				res.body.state.should.equal(newUser.state);
				res.body.postalCode.should.equal(newUser.postalCode);
				res.body.country.should.equal(newUser.country);
				res.body.userType.should.equal(newUser.userType);
			});
		});
	});

	describe('PUT /:id', function() {
		it('should update a user by id', function() {
			let user;
			updatedFields = {
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

			db.User.findOne()
			.then(function(_user) {
				user = _user;
				return chai.request(app).put(`/users/${user.id}`).send(updatedFields)
			})
			.then(function(res) {
				res.should.have.status(204);
				return User.findById(user.id);
			})
			.then(function(updatedUser) {
				updatedUser.userName.should.equal(updatedFields.userName);
				updatedUser.firstName.should.equal(updatedFields.firstName);
				updatedUser.lastName.should.equal(updatedFields.lastName);
				updatedUser.password.should.equal(updatedFields.password);
				updatedUser.email.should.equal(updatedFields.email);
				updatedUser.streetAddress.should.equal(updatedFields.streetAddress);
				updatedUser.state.should.equal(updatedFields.state);
				updatedUser.postalCode.should.equal(updatedFields.postalCode);
				updatedUser.country.should.equal(updatedFields.country);
				updatedUser.userType.should.equal(updatedFields.userType);
			});
		});
	});

	describe('DELETE /:id', function() {
		it('should delete a user by id', function() {
			let user;
			return db.User.findOne()
			.then(function(_user) {
				user = _user;
				return chai.request(app).delete(`/users/${user.id}`);
			})
			.then(function(res) {
				res.should.have.status(204);
				return db.User.findById(user.id);
			})
			.then(function(user) {
				should.not.exist(user);
			});
		});
	});
});