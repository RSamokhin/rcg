module.exports = function(sequelize, DataTypes) {
    var NewsComments = sequelize.define("NewsComments", {
        id: {
            type: DataTypes.INTEGER,
            field: 'comment_id',
            primaryKey: true
        },
        newsId: {
            type: DataTypes.INTEGER,
            field: 'news_id'
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id'
        },
        text: {
            type: DataTypes.STRING,
            field: 'comment_text'
        },
        timestamp: {
            type: DataTypes.DATE,
            field: 'TIMESTAMP'
        },
        commentType: {
            type: DataTypes.STRING(1),
            field: 'comment_type'
        }
    }, {
        classMethods: {
            associate: function(models) {

            }
        },
        tableName: 'news_comments'
    });
    return NewsComments;
};
