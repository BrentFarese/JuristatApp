const express = require('express');
const router = express.Router();

const {Application, Document, Index, Matter, Task, User} = require('../models');

router.get('/', (req, res) => {
	User.findAll()
	.then(users => res.json(users.apiRepr()));
})

router.get('/:id', (req, res) => {
	User.findById(req.params.id)
	.then(user => res.json(user.apiRepr()));
});

router.get('/:id/applications', (req, res) => {
	User.findById(req.params.id, {
		include: [{
			model: Application,
			as: 'applications'
		}]})
	.then(applications => res.json({applications: applications.map(app => app.apiRepr())}));
});

router.get('/:id/matters', (req, res) => {
	User.findById(req.params.id, {
		include: [{
			model: Matter,
			as: 'matters'
		}]})
	.then(matters => res.json({matters: matters.map(matter => matter.apiRepr())}));
});

router.get('/:id/tasks', (req, res) => {
	User.findById(req.params.id, {
		include: [{
			model: Task,
			as: 'tasks'
		}]})
	.then(tasks => res.json({tasks: tasks.map(task => task.apiRepr())}));
});

router.post('/', (req, res) => {
	const requiredFields = ['userName', 'firstName', 'lastName', 'password', 'email', 'userType'];
	
	for (let i=0; i<requiredFields.length; i++) {
		if (!(requiredFields[i] in req.body)) {
			field = requiredFields[i];
			const message = `Request body is missing ${field}.  Please include ${field}.`
			console.error(message);
			return res.status(400).send(message);
		}
	};

	return User.create({
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password,
		email: req.body.email,
		streetAddress: req.body.streetAddress,
		state: req.body.state,
		postalCode: req.body.postalCode,
		country: req.body.country,
		userType: req.body.userType
	})
	.then(user => {
		res.status(201).json(user.apiRepr());
	})
	.catch(err => {
		return res.status(500).send({message: err.message});
	});
});

router.put('/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id.toString())) {
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`);
		res.status(400).json({message: message});
	}

	const newUser = {};
	const updateableFields = ['userName', 'firstName', 'lastName', 'password', 'email', 'streetAddress', 'state', 'postalCode', 'country', 'userType'];

	updateableFields.forEach( field => {
		if (field in req.body) {
			newUser[field] = req.body[field];
		}
	});

	return User.update(newUser, {
		where: {
			id: req.body.id
		}
	})
	.then( () => {
		res.status(204).end()
	})
	.catch(err => res.status(500).json({message: 'Internal server error.'}));

});

