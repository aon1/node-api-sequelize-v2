const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
  	hooks: {
      beforeCreate: (user) => {
      	console.log("password on create user " + user.password)
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
  	freezeTableName: true,
  	tableName: 'user'
  });

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  return User;
}