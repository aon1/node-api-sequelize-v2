const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = user.hashPassword(user.password)
      },
      beforeUpdate: (user) => {
        user.password = user.hashPassword(user.password)
      }
    },
    freezeTableName: true,
    tableName: 'user'
  });

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  User.prototype.hashPassword = function(password) {
    const salt = bcrypt.genSaltSync();
    
    return bcrypt.hashSync(password, salt);
  }

  return User;
}