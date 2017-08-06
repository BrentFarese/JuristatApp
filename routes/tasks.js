const express = require('express');
const router = express.Router();

const {db} = require('../models');

router.get('/:id', (req, res) => {
	db.Task.findById(req.params.id)
	.then(task => res.status(200).json(task.apiRepr()));
});

router.get(':id/users', (req, res) => {
	db.Task.findById(req.params.id, {
		include: [{
			model: User,
			as: 'users'
		}]
	})
	.then(task => res.status(200).json({users: task.users.map(user => user.apiRepr())}));
});

router.get(':id/documents', (req, res) => {
	db.Task.findById(req.params.id, {
		include: [{
			model: Document,
			as: 'documents'
		}]
	})
	.then(task => res.status(200).json({documents: task.documents.map(document => document.apiRepr())}));
});

router.get(':id/applications', (req, res) => {
	db.Matter.findById(req.params.id, {
		include: [{
			model: Application,
			as: 'applications'
		}]
	})
	.then(matter => res.status(200).json({applications: matter.applications.map(application => application.apiRepr())}));
});

router.get(':id/matters', (req, res) => {
	db.Task.findById(req.params.id, {
		include: [{
			model: Matter,
			as: 'matters'
		}]
	})
	.then(task => res.status(200).json({matters: task.matters.map(matter => matter.apiRepr())}));
});

router.post('/', (req, res) => {
	const requiredFields = ['completed', 'taskDescription', 'dueDate'];
	
	for (let i=0; i<requiredFields.length; i++) {
		if (!(requiredFields[i] in req.body)) {
			field = requiredFields[i];
			const message = `Request body is missing ${field}.  Please include ${field}.`
			console.error(message);
			return res.status(400).send(message);
		}
	};

	return db.Task.create({
		completed: req.body.completed,
		taskDescription: req.body.taskDescription,
		dueDate: req.body.dueDate
	})
	.then(task => {
		res.status(201).json(task.apiRepr());
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

	const newTask = {};
	const updateableFields = ['completed', 'taskDescription', 'dueDate'];

	updateableFields.forEach( field => {
		if (field in req.body) {
			newTask[field] = req.body[field];
		}
	});

	return db.Task.update(newTask, {
		where: {
			id: req.body.id
		}
	})
	.then( () => {
		res.status(204).end()
	})
	.catch(err => res.status(500).json({message: 'Internal server error.'}));

});

router.delete('/:id', (req, res) => {
	return db.Task
	.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(() => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;