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
        money: DataTypes.STRING,
        workTime: {
            type: DataTypes.STRING,
            field: 'work_time'
        },
        endTime: {
            type: DataTypes.STRING,
            field: 'end_time'
        },
        city:DataTypes.STRING
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
