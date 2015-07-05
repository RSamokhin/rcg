module.exports = function(sequelize, DataTypes) {
    var Vacancy = sequelize.define("Vacancy", {
        newsId: {
            type: DataTypes.INTEGER,
            field: 'news_id',
            primaryKey: true
        },
        isMale: {
            type: DataTypes.BOOLEAN,
            field: 'is_male'
        },
        money: DataTypes.STRING(1)
    }, {
        classMethods: {
            associate: function(models) {
                Vacancy.belongsTo(models.News, {
                    foreignKey: 'newsId'
                });
            }
        },
        tableName: 'vacancy'
    });
    return Vacancy;
};
