'use strict';

const Sequelize = require('Sequelize');

const {sequelize} = require('../db/sequelize');

const UserMatter = sequelize.define('UserMatters', {
	matterId: {
		type: Sequelize.INTEGER,
		field: 'matter_id'
	},
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id'
	}
}, {
	tableName: 'UserMatter',
	underscored: true,
	classMethods: {
		associate: function(models) {
			UserMatter.belongsTo(models.User, {
				as: 'users',
				onDelete: 'CASCADE'
			});
			UserMatter.belongsTo(models.Matter, {
				as: 'matters', 
				onDelete: 'CASCADE'
			});
		}
	}
});

module.exports = {
	UserMatter
};