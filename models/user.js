'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const User = sequelize.define('Users', {
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
	userName: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'user_name'
	},
	firstName: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'first_name'
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'last_name'
	},
	password: {
		type: Sequelize.STRING,
		allowNull:false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	address: {
		type: Sequelize.TEXT
	},
	userType: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'user_type'
	}, {
		tableName: 'users',
		underscored: true, 
		classMethods: {
			associate: function(models) {
				User.hasMany(models.Application, {
					as: 'applications', 
					onDelete: 'SET NULL'
				});
				User.hasMany(models.Matter, {
					as: 'matters', 
					onDelete: 'SET NULL'
				});
				User.hasMany(models.Task, {
					as: 'tasks',
					onDelete: 'SET NULL'
				});
			}
		},
		instanceMethods: {
			apiRepr: function() {
				return {
					id: this.id,
					userName: this.userName,
					firstName: this.firstName,
					lastName: this.lastName,
					password: this.password,
					email: this.email,
					address: this.address,
					userType: this.userType
				};
			}
		}
	}
});

module.exports = {
	User
};