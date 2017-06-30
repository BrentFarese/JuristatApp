const express = require('express');
const router = express.Router();

const {db} = require('../models');

router.get('/:id', (req, res) => {
	db.Document.findById(req.params.id)
	.then(document => res.status(200).json(document.apiRepr()));
});

router.get('/:id/tasks', (req, res) => {
	db.Document.findById(req.params.id, {
		include: [{
			model: Task,
			as: 'tasks'
		}]
	})
	.then(docment => res.status(200).json({tasks: document.tasks.map(task => task.apiRepr())}));
});

router.post('/', (req, res) => {
	const requiredFields = ['documentType', 'url'];
	
	for (let i=0; i<requiredFields.length; i++) {
		if (!(requiredFields[i] in req.body)) {
			field = requiredFields[i];
			const message = `Request body is missing ${field}.  Please include ${field}.`
			console.error(message);
			return res.status(400).send(message);
		}
	};

	return db.Document.create({
		documentType: req.body.documentType,
		url: req.body.url
	})
	.then(document => {
		res.status(201).json(document.apiRepr());
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

	const newDocument = {};
	const updateableFields = ['documentType', 'url'];

	updateableFields.forEach( field => {
		if (field in req.body) {
			newDocument[field] = req.body[field];
		}
	});

	return db.Document.update(newDocument, {
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
	return db.Document
	.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(() => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;