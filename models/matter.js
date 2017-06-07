'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const Matter = sequelize.define('Matters', {
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
	firmReference: {
		type: Sequelize.STRING,
		field: 'firm_reference'
	},
	clientReference: {
		type: Sequelize.STRING,
		field: 'client_reference'
	},
	legalType: {
		type: Sequelize.STRING,
		field: 'legal_type'
	},
	importanceLevel: {
		type: Sequelize.INTEGER,
		field: 'importance_level'
	}
}, {
	tableName: 'matters',
	underscored: true,
	classMethods: {
		associate: function(models) {
			Matter.belongsTo(models.Application, {
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
			Matter.belongsToMany(models.User, {
				through: 'UserMatter'
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
});

module.exports = {
	Matter
};