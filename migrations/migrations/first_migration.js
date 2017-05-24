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
					allowNull: false 
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
					allowNull: false
				},
				address: {
					type: Sequelize.TEXT
				},
				userType: {
					type: Sequelize.STRING,
					allowNull: false 
				}
			});
		
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
					allowNull: false
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
				userId: {
					type: Sequelize.UUID,
					references: {
						model: 'users',
						key: 'id'
					},
					onDelete: 'SET NULL'
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
				}
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
					default: false
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
				applicationId: {
					type: Sequelize.UUID,
					references: {
						model: 'applications',
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
					onDelete: 'cascade'
				}
			});
	},

	down: (queryInterface, Sequelize) => {

		queryInterface.dropTable('users');
		queryInterface.dropTable('applications');
		queryInterface.dropTable('matters');
		queryInterface.dropTable('tasks');
		queryInterface.dropTable('documents');
	}
};