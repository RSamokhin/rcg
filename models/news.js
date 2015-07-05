module.exports = function(sequelize, DataTypes) {
    var News = sequelize.define("News", {
        id: {
            type: DataTypes.INTEGER,
            field: 'n_id'
        },
        authorId: {
            type: DataTypes.STRING,
            field: 'author_id'
        },
        title: DataTypes.STRING,
        picture: DataTypes.STRING,
        shortText: {
            type: DataTypes.STRING,
            field: 'short_text'
        },
        text: DataTypes.STRING,
        datePublished: {
            type: DataTypes.DATE,
            field: 'datepubliched'
        },
        dateCreated: {
            type: DataTypes.DATE,
            field: 'datecreated'
        },
        isVacancy: {
            type: DataTypes.BOOLEAN,
            field: 'is_vacancy'
        },
        isDraft: {
            type: DataTypes.BOOLEAN,
            field: 'is_draft'
        },
        isProject: {
            type: DataTypes.BOOLEAN,
            field: 'is_project'
        }
    }, {
        classMethods: {
            associate: function(models) {
                News.hasOne(models.Vacancy, {
                    foreignKey: 'newsId'
                });
                News.hasMany(models.NewsComments, {
                    foreignKey: 'newsId'
                });
            }
        }
    });
    return News;
};