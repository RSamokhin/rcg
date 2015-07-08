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
        commentStatus: {
            type: DataTypes.STRING,
            field: 'comment_status'
        },
        adminComment: {
            type: DataTypes.STRING,
            field: 'admin_comment'
        }
    }, {
        classMethods: {
            associate: function(models) {
                NewsComments.belongsTo(models.News, {
                    foreignKey: 'newsId'
                });
            }
        },
        tableName: 'news_comments'
    });
    return NewsComments;
};
