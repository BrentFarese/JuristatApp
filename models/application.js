'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const Application = sequelize.define('Applications', {
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
	serialNumber: {
		type: Sequelize.INTEGER,
		field: 'serial_number',
		allowNull: false
	},
	title: {
		type: Sequelize.TEXT
	}, {
		tableName: 'applications',
		underscored: true,
		classMethods: function() {
			associate: function(models) {
				Application.hasOne(models.Matter, {
					as: 'matters',
					onDelete: 'SET NULL'
				});
				Application.hasMany(models.Task, {
					as: 'tasks',
					onDelete: 'cascade'
				});
				Application.hasMany(models.Document, {
					as: 'documents',
					onDelete: 'cascade'
				});
			}
		}, 
		instanceMethods: {
			apiRepr: function() {
				return {
					id: this.id,
					serialNumber: this.serialNumber,
					title: this.title
				};
			}
		}
	}
}
});

module.exports = {
	Application
};