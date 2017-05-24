'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const Document = Sequelize.define('Documents', {
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
	documentType: {
		type: Sequelize.STRING,
		allowNull: false
	},
	url: {
		type: Sequelize.TEXT,
		allowNull: false
	}, {
		tableName: 'documents',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Document.hasMany(models.Task, {
					as: 'tasks',
					onDelete: 'SET NULL'
				});
				Document.hasOne(models.Application, {
					as: 'applications',
					onDelete: 'SET NULL'
				});
				Document.hasOne(models.Matter, {
					as: 'matters',
					onDelete: 'SET NULL'
				});
			}
		},
		instanceMethods: {
			apiRepr: function() {
				return {
					id: this.id,
					documentType: this.documentType,
					url: this.url
				};
			}
		}
	}
});

module.exports = {
	Document
};