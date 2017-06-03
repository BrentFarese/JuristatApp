'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const Document = sequelize.define('Documents', {
	id: {
		type: Sequelize.UUID,
		primaryKey: true
	},
	createdAt: {
		type: Sequelize.DATE,
		field: 'created_at'
	},
	updatedAt: {
		type: Sequelize.DATE,
		field: 'updated_at'
	},
	documentType: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'document_type'
	},
	url: {
		type: Sequelize.TEXT,
		allowNull: false
	}
}, {
	tableName: 'documents',
	underscored: true,
	classMethods: {
		associate: function(models) {
			Document.hasOne(models.Task, {
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
});

module.exports = {
	Document
};