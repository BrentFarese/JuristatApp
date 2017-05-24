'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const Task = Sequelize.define('Tasks', {
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
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		default: false
	},
	taskDescription: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	dueDate: {
		type: Sequelize.DATE,
		allowNull: false
	}, {
		tableName: 'tasks',
		underscored: true,
		classMethods: {
			associate: function(models) {
				Task.hasMany(models.Document, {
					as: 'documents',
					onDelete: 'SET NULL'
				});
				Task.hasOne(models.Matter, {
					as: 'matters',
					onDelete: 'SET NULL'
				});
				Task.hasOne(models.Application, {
					as: 'applications',
					onDelete: 'SET NULL'
				});
				Task.hasOne(models.User, {
					as: 'users',
					onDelete: 'SET NULL'
				});
			}
		},
		instanceMethods: {
			apiRepr: function() {
				return {
					id: this.id,
					completed: this.completed,
					taskDescription: this.taskDescription,
					dueDate: this.dueDate
				};
			}
		}
	}
});

module.exports = {
	Task
};