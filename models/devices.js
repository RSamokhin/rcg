module.exports = function(sequelize, DataTypes) {
    var Devices = sequelize.define("Devices", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: DataTypes.STRING(500),
        date: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {

            }
        },
        tableName: 'devices'
    });
    return Devices;
};