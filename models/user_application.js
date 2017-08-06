'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const UserApplication = sequelize.define('UserApplications', {
	applicationId: {
		type: Sequelize.INTEGER,
		field: 'application_id'
	},
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id'
	}
}, {
	tableName: 'UserApplication',
	underscored: true,
	classMethods: {
		associate: function(models) {
			UserApplication.belongsTo(models.User, {
				as: 'users',
				onDelete: 'CASCADE'
			});
			UserApplication.belongsTo(models.Application, {
				as: 'applications', 
				onDelete: 'CASCADE'
			});
		}
	}
});

module.exports = {
	UserApplication
};