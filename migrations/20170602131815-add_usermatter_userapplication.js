'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.createTable(
    'user_matters', {
      matterId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'matters',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'cascade'
      }
    })
   .then(() => {
    queryInterface.addIndex('user_matters', ['matterId']);
    queryInterface.addIndex('user_matters', ['userId']);
  });

   queryInterface.createTable(
    'user_applications', {
      applicationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'applications',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'cascade'
      }
    })
   .then(() => {
    queryInterface.addIndex('user_applications', ['applicationId']);
    queryInterface.addIndex('user_applications', ['userId']);
  });

 },

 down: function (queryInterface, Sequelize) {
  queryInterface.dropTable('user_matters');
  queryInterface.dropTable('user_applications');
}
};
