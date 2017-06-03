const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const should = chai.should();
const app = require('../app');

const {Application} = require('../models/application'); 
const {Document} = require('../models/document');
const {Matter} = require('../models/matter');
const {Task} = require('../models/task');
const {User} = require('../models/user');
const {seedDatabase, dropRecords} = require('./helpers');

chai.use(chaiHttp);

describe('users routes', function() {
	
	beforeEach(function() {
		return dropRecords()
		.then(function() {
			return seedDatabase(1);
		});
	});	
	
	describe('GET /users/:id', function() {
		it('should return user by ID', function() {
			let user;
			return User.findOne()
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

	// describe('GET /users/:id/applications', function() {
	// 	it('should return all applications for a user', function() {
	// 		return User.findOne({
	// 			include: [{
	// 				model: Application,
	// 				through: 'UserApplication'
	// 			}]
	// 		})
	// 		.then(user => {
	// 			return chai.request(app)
	// 			.get(`/users/${this.user.id}/applications`);
	// 		})
	// 		.then(res => {
	// 			res.should.have.status(200);
	// 			res.body.id.should.equal(this.user.id);
	// 			res.body.applications.forEach(application => {
	// 				application.should.be.a('object');
	// 				application.should.include.keys('id', 'createdAt', 'updatedAt', 'serialNumber', 'title');
	// 			});
	// 			this.user.applications.map(application => application.id).should.deep.equal(res.body.applications.map(application => application.id));
	// 		});
	// 	});
	// });

	// describe('GET /users/:id/matters', function() {
	// 	it('should return all matters for a user', function () {
	// 		return User.findOne({
	// 			include: [{
	// 				model: Matter,
	// 				through: 'UserMatter'
	// 			}]
	// 		})
	// 		.then(user => {
	// 			return chai.request(app)
	// 			.get(`/users/${this.user.id}/matters`);
	// 		})
	// 		.then(res => {
	// 			res.should.have.status(200);
	// 			res.body.id.should.equal(this.user.id);
	// 			res.body.matters.forEach(matter => {
	// 				matter.should.be.a('object');
	// 				matter.should.include.keys('id', 'createdAt', 'updatedAt', 'firmReference', 'clientReference', 'legalType', 'importanceLevel');
	// 			});
	// 			this.user.matters.map(matter => matter.id).should.deep.equal(res.body.matters.map(matter => matter.id));
	// 		});
	// 	});
	// });

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
});