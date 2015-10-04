module.exports = function(sequelize, DataTypes) {
    var Feedback = sequelize.define("Feedback", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING(50),
        email: DataTypes.STRING(50),
        phone: DataTypes.STRING(50),
        text: DataTypes.STRING(500),
        status: DataTypes.STRING(50),
        replyComment: {
            type: DataTypes.STRING(256),
            field: 'reply_comment'
        }
    }, {
        classMethods: {
            associate: function(models) {

            }
        },
        tableName: 'feedbacks',
        ommitNull: false
    });
    return Feedback;
};