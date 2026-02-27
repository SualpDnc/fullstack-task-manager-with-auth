const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'tasks',
    timestamps: true // adds createdAt and updatedAt automatically
});

const User = require('./User');
Task.belongsTo(User); // Task has a userId column now
User.hasMany(Task);
module.exports = Task;