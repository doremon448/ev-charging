const sequelize = require('../config/database');
const Station = require('./Station');
const User = require('./User');

// Define associations
User.hasMany(Station, { foreignKey: 'userId', as: 'stations' });
Station.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

module.exports = {
  sequelize,
  Station,
  User,
};