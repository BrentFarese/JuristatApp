'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const User = sequelize.define('Users', {
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
	userName: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
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
		allowNull: false,
		unique: true
	},
	streetAddress: {
		type: Sequelize.TEXT,
		field: 'street_address'
	},
	state: {
		type: Sequelize.STRING
	},
	postalCode: {
		type: Sequelize.STRING,
		field: 'postal_code'
	},
	country: {
		type: Sequelize.STRING, 
		defaultValue: 'US'
	},
	userType: {
		type: Sequelize.STRING,
		allowNull: false,
		field: 'user_type'
	}
}, {
	tableName: 'users',
	underscored: true, 
	classMethods: {
		associate: function(models) {
			User.belongsToMany(models.Application, {
				through: 'UserApplication'
			});
			User.belongsToMany(models.Matter, {
				through: 'UserMatter'
			});
			User.belongsToMany(models.Task, {
				through: 'UserTask'
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
				streetAddress: this.streetAddress,
				state: this.state,
				postalCode: this.postalCode,
				country: this.country,
				userType: this.userType
			};
		}
	}
});

module.exports = {
	User
};