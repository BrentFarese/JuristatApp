'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([

        queryInterface.sequelize.query('CREATE EXTENSION "uuid-ossp"')
        .then(() => { 

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
            }, 
            {
              transaction: t
            })
          .then(() => { 
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
              })
            .then(() => {
              queryInterface.addIndex('applications', ['serialNumber'], {
                indicesType: 'UNIQUE'
              });
              queryInterface.addIndex('applications', ['userId']);

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
                })
              .then(() => {
                queryInterface.addIndex('matters', ['firmReference'], {
                  indicesType: 'UNIQUE'
                });

                queryInterface.addIndex('matters', ['clientReference'], {
                  indicesType: 'UNIQUE'
                });

                queryInterface.addIndex('matters', ['importanceLevel']);

                queryInterface.addIndex('matters', ['applicationId'], {
                  indicesType: 'UNIQUE'
                });

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
                  })
                .then(() => {
                  queryInterface.addIndex('tasks', ['completed']);

                  queryInterface.addIndex('tasks', ['dueDate']);

                  queryInterface.addIndex('tasks', ['userId']);

                  queryInterface.addIndex('tasks', ['matterId']);
                })
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
                  })
                .then(() => {
                  queryInterface.addIndex('documents', ['documentType']);

                  queryInterface.addIndex('documents', ['applciationId']);

                  queryInterface.addIndex('documents', ['taskId']);

                  queryInterface.addIndex('documents', ['matterId']);
                  queryInterface.createTable(
                    'userTask', {
                      taskId: {
                        type: Sequelize.UUID,
                        references: {
                          model: 'tasks', 
                          key: 'id'
                        },
                        onDelete: 'cascade' 
                      },
                      userId: {
                        type: Sequelize.UUID,
                        references: {
                          model: 'users',
                          key: 'id'
                        },
                        onDelete: 'cascade'
                      }
                    })
                })
              })
            })
          })
        })
      ])
    })
  },


  down: (queryInterface, Sequelize) => {

    queryInterface.dropTable('users');
    queryInterface.dropTable('applications');
    queryInterface.dropTable('matters');
    queryInterface.dropTable('tasks');
    queryInterface.dropTable('documents');
    queryInterface.dropTable('userTask');
    queryInterface.sequelize.query('DROP EXTENSION "uuid-ossp"');
  }
};