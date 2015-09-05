
var crypto = require('crypto');

var salt = '1af13fvasdfkpm,mbjdfld934';

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        phone: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        fname: DataTypes.STRING(255),
        lname: DataTypes.STRING(255),
        pwdhash: DataTypes.STRING(255),
        email: DataTypes.STRING(255)
    }, {
        classMethods: {
            associate: function(models) {

            }
        },
        instanceMethods: {
            encryptPassword: function(password)
            {
                if (!password)
                    return '';
                try {
                    return crypto
                        .createHmac('sha1', salt)
                        .update(password)
                        .digest('hex');
                } catch (err) {
                    return '';
                }
            }
        },
        tableName: 'users'
    });
    return User;
};