'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const Matter = Sequelize.define('Matters', {
	id: {
		type: Sequelize.UUID,
		primaryKey: true
	},
	createdAt: {
		type: Sequelize.DATE
	},
	updatedAt: {
		type: Sequelize.DATE
	},
	firmReference: {
		type: Sequelize.STRING
	},
	clientReference: {
		type: Sequelize.STRING
	},
	legalType: {
		type: Sequelize.STRING
	},
	importanceLevel: {
		type: Sequelize.INTEGER
	}, {
		tableName: 'matters',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Matter.hasOne(models.Application, {
					as: 'applications',
					onDelete: 'SET NULL'
				});
				Matter.hasMany(models.Task, {
					as: 'tasks',
					onDelete: 'cascade'
				});
				Matter.hasMany(models.Document, {
					as: 'documents',
					onDelete: 'SET NULL'
				});
			}
		},
		instanceMethods: {
			apiRepr: function() {
				return {
					id: this.id,
					firmReference: this.firmReference,
					clientReference: this.clientReference,
					legalType: this.legalType,
					importanceLevel: this.importanceLevel
				}; 
			}
		}
	}
});

module.exports = {
	Matter
};