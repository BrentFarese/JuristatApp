'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'users',
      {
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
        userName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true 
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
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
          type: Sequelize.TEXT
        },
        state: {
          type: Sequelize.STRING
        },
        postalCode: {
          type: Sequelize.STRING
        },
        country: {
          type: Sequelize.STRING, 
          defaultValue: 'US'
        },
        userType: {
          type: Sequelize.STRING,
          allowNull: false 
        }
      });

    queryInterface.addIndex('users', ['email'], {
      indicesType: 'UNIQUE'
    });

    queryInterface.addIndex('users', ['userName'], {
      indicesType: 'UNIQUE'
    });

    queryInterface.addIndex('users', ['userType']);
    
    queryInterface.createTable(
      'applications', 
      {
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
        serialNumber: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true
        },
        title: {
          type: Sequelize.TEXT,
        },
        userId: {
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'SET NULL'
        }
      });

    queryInterface.addIndex('applications', ['serialNumber'], {
      indicesType: 'UNIQUE'
    });

    queryInterface.createTable(
      'matters', {
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
        firmReference: {
          type: Sequelize.STRING
        },
        clientReference: {
          type: Sequelize.STRING
        },
        legalType: {
          type: Sequelize.STRING
        },
        importanceLevel: {
          type: Sequelize.INTEGER
        },
        applicationId: {
          type: Sequelize.UUID,
          references: {
            model: 'applications',
            key: 'id'
          },
          onDelete: 'cascade'
        }
      });

    queryInterface.addIndex('matters', ['firmReference'], {
      indicesType: 'UNIQUE'
    });

    queryInterface.addIndex('matters', ['clientReference'], {
      indicesType: 'UNIQUE'
    });

    queryInterface.addIndex('matters', ['importanceLevel']);

    queryInterface.createTable(
      'tasks', {
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
          defaultValue: false
        },
        taskDescription: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        dueDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        userId: {
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'SET NULL'
        },
        matterId: {
          type: Sequelize.UUID,
          references: {
            model: 'matters',
            key: 'id'
          },
          onDelete: 'cascade'
        }
      });

    queryInterface.addIndex('tasks', ['completed']);

    queryInterface.addIndex('tasks', ['dueDate']);

    queryInterface.createTable(
      'documents', {
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
        documentType: {
          type: Sequelize.STRING,
          allowNull: false
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        applicationId: {
          type: Sequelize.UUID,
          references: {
            model: 'applications',
            key: 'id'
          },
          onDelete: 'SET NULL'
        },
        taskId: {
          type: Sequelize.UUID,
          references: {
            model: 'tasks',
            key: 'id'
          },
          onDelete: 'SET NULL'
        },
        matterId: {
          type: Sequelize.UUID,
          references: {
            model: 'matters',
            key: 'id'
          },
          onDelete: 'SET NULL'
        }
      });

    queryInterface('documents', ['documentType']);
    
  },

  down: (queryInterface, Sequelize) => {

    queryInterface.dropTable('users');
    queryInterface.dropTable('applications');
    queryInterface.dropTable('matters');
    queryInterface.dropTable('tasks');
    queryInterface.dropTable('documents');
  }
};