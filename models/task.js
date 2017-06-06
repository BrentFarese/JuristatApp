'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const Task = sequelize.define('Tasks', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	createdAt: {
		type: Sequelize.DATE, 
		field: 'created_at'
	},
	updatedAt: {
		type: Sequelize.DATE,
		field: 'updated_at'
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		default: false
	},
	taskDescription: {
		type: Sequelize.TEXT,
		allowNull: false,
		field: 'task_description'
	},
	dueDate: {
		type: Sequelize.DATE,
		allowNull: false,
		field: 'due_date'
	}
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
			Task.belongsToMany(models.User, {
				through: 'UserTask'
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
});

module.exports = {
	Task
};