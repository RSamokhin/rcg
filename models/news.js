
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
        }
    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });

    return News;
};