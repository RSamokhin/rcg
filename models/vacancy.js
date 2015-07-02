module.exports = function(sequelize, DataTypes) {
    var Vacancies = sequelize.define("Vacancies", {
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
        picturePreview: {
            type: DataTypes.STRING,
            field: 'picture_preview'
        },
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
    return Vacancies;
};