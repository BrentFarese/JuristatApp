const express = require('express');
const router = express.Router();

const {db} = require('../models');

router.get('/', (req, res) => {
	db.Application.findAll()
	.then(applications => res.status(200).json({applications: applications.map(application => application.apiRepr())}));
})

router.get('/:id', (req, res) => {
	db.Application.findById(req.params.id)
	.then(application => res.status(200).json(application.apiRepr()));
});

router.get('/:id/tasks', (req, res) => {
	db.Application.findById(req.params.id, {
		include: [{
			model: Task,
			as: 'tasks'
		}]})
	.then(application => res.json({tasks: application.tasks.map(task => task.apiRepr())}));
});

router.get('/:id/documents', (req, res) => {
	db.Application.findById(req.params.id, {
		include: [{
			model: Document,
			as: 'documents'
		}]})
	.then(application => res.status(200).json({documents: application.documents.map(document => document.apiRepr())}));
});

router.post('/:id', (req, res) => {
	const requiredFields = ['serialNumber', 'title'];
	console.log(req.body);	
	for (let i=0; i<requiredFields.length; i++) {
		if (!(requiredFields[i] in req.body)) {
			field = requiredFields[i];
			const message = `Request body is missing ${field}.  Please include ${field}.`
			console.error(message);
			return res.status(400).send(message);
		}
	};

	return db.Application.create({
		serialNumber: req.body.serialNumber,
		title: req.body.title
	})
	.then(application => {
		res.status(201).json(application.apiRepr());
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

	const newApplication = {};
	const updateableFields = ['serialNumber', 'title'];

	updateableFields.forEach( field => {
		if (field in req.body) {
			newApplication[field] = req.body[field];
		}
	});

	return db.Application.update(newApplication, {
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
	return db.Application
	.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(() => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;


