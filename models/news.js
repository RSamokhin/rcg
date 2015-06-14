
module.exports = function(sequelize, DataTypes) {
    var News = sequelize.define("News", {
        id: {
            type: DataTypes.INTEGER,
            field: 'n_id'
        },
        title: DataTypes.STRING,
        authorId: {
            type: DataTypes.STRING,
            field: 'author_id'
        },
        text: DataTypes.STRING,
        shortText: {
            type: DataTypes.STRING,
            field: 'short_text'
        },
        isVacancy: {
            type: DataTypes.BOOLEAN,
            field: 'is_vacancy'
        },
        dateCreated: {
            type: DataTypes.DATE,
            field: 'datecreated'
        },
        datePublished: {
            type: DataTypes.DATE,
            field: 'datepubliched'
        }
    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });

    return News;
};