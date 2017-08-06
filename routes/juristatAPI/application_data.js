const express = require('express');
const router = express.Router();
const request = require('request-promise');

const APIKey = '8956f37c58ed7d5a745f8db56733c548e2f8f6e04dcd5b93789c6b17c75c6a57';
const APIId = 'e6d50694-d692-445e-b14d-d24b5997230c';

router.get('/:applicationNo', (req, res) => {
	const url = `https://api.juristat.com/applications/${req.params.applicationNo}`;
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
		// const applicationData = {
		// 	appno: data.appno,
		// 	title: data.title,
		// 	artUnit: data.artUnit,
		// 	filingDate: data.filingDate,
		// 	status: data.status,
		// 	examiner: data.examiners.main,
		// }
		res.send(data);
	})
})

module.exports = router;
