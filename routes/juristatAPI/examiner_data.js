const express = require('express');
const router = express.Router();
const request = require('request-promise');

const APIKey = '8956f37c58ed7d5a745f8db56733c548e2f8f6e04dcd5b93789c6b17c75c6a57';
const APIId = 'e6d50694-d692-445e-b14d-d24b5997230c';

router.get('/:examinerId', (req, res) => {
	const url = `https://api.juristat.com/examiners/${req.params.examinerId}/key-metrics/by/year`;
	const options = {
		url: url,
		headers: {
			'X-API-ID': APIId,
			'X-API-KEY': APIKey
		},
		json: true
	};
	return request(options)
	.then(data => {
		res.send(data);
	})
})

module.exports = router;
