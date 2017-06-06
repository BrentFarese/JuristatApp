'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   queryInterface.createTable(
    'UserMatter', {
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
    queryInterface.addIndex('UserMatter', ['matterId']);
    queryInterface.addIndex('UserMatter', ['userId']);
  });

   queryInterface.createTable(
    'UserApplication', {
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
    queryInterface.addIndex('UserApplication', ['applicationId']);
    queryInterface.addIndex('UserApplication', ['userId']);
  });

 },

 down: function (queryInterface, Sequelize) {
  queryInterface.dropTable('UserMatter');
  queryInterface.dropTable('UserApplication');
}
};
