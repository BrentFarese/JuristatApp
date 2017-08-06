const express = require('express');
const router = express.Router();
const request = require('request-promise');

const APIKey = '8956f37c58ed7d5a745f8db56733c548e2f8f6e04dcd5b93789c6b17c75c6a57';
const APIId = 'e6d50694-d692-445e-b14d-d24b5997230c';

function requestAnalytics(selector, id) {
	const url = `https://api.juristat.com/${selector}/${id}/key-metrics/by/year`;
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
			return [selector, data.year];
		})
}

router.get('/:examinerId/:artUnitId', (req, res) => {
	Promise.all([
		requestAnalytics('examiners', req.params.examinerId),
		requestAnalytics('art-units', req.params.artUnitId)
		]).
	then(values => {
		let dataSet = {}
		for (let value of values) {
			for (const x in value[1]) {
				if(!dataSet[x]) {
					dataSet[x] = {year: x}
				}
				dataSet[x][`${value[0]}AvgOfficeActions`] = value[1][x].office_actions.to_allowance.average
			}
		}
		res.send(Object.values(dataSet));
	})
})

module.exports = router;
