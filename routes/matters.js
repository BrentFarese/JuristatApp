const express = require('express');
const router = express.Router();

const {db} = require('../models');

router.get('/:id', (req, res) => {
	db.Matter.findById(req.params.id)
	.then(matter => res.status(200).json(matter.apiRepr()));
});

router.get('/:id/tasks', (req, res) => {
	db.Matter.findById(req.params.id, {
		include: [{
			model: Task,
			as: 'tasks'
		}]
	})
	.then(matter => res.status(200).json({tasks: matter.tasks.map(task => task.apiRepr())}));
});

router.get(':id/users', (req, res) => {
	db.Matter.findById(req.params.id, {
		include: [{
			model: User,
			as: 'users'
		}]
	})
	.then(matter => res.status(200).json({users: matter.users.map(user => user.apiRepr())}));
});

router.get(':id/documents', (req, res) => {
	db.Matter.findById(req.params.id, {
		include: [{
			model: Document,
			as: 'documents'
		}]
	})
	.then(matter => res.status(200).json({documents: matter.documents.map(document => document.apiRepr())}));
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

router.post('/', (req, res) => {
	const requiredFields = ['firmReference', 'clientReference', 'legalType', 'importanceLevel'];
	
	for (let i=0; i<requiredFields.length; i++) {
		if (!(requiredFields[i] in req.body)) {
			field = requiredFields[i];
			const message = `Request body is missing ${field}.  Please include ${field}.`
			console.error(message);
			return res.status(400).send(message);
		}
	};

	return db.Matter.create({
		firmReference: req.body.firmReference,
		clientReference: req.body.clientReference,
		legalType: req.body.legalType,
		importanceLevel: req.body.importanceLevel
	})
	.then(matter => {
		res.status(201).json(matter.apiRepr());
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

	const newMatter = {};
	const updateableFields = ['firmReference', 'clientReference', 'legalType', 'importanceLevel'];

	updateableFields.forEach( field => {
		if (field in req.body) {
			newMatter[field] = req.body[field];
		}
	});

	return db.Matter.update(newMatter, {
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
	return db.Matter
	.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(() => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;