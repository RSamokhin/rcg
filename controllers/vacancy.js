
var parse = require('co-body');

var models = require("../models");


module.exports.listVacancies = function() {
    /*return function * () {
        var start = this.query['start'] | 0;
        var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
        count = Math.max(count, 1);
        start = Math.max(start, 0);
        var vacancy = yield models.Vacancies.findAll({
            limit: count,
            offset: start,
            where: {
                is_vacancy: 1,
                is_project: 0,
                is_draft:0
            }
        });
        this.body = vacancy.map(vacancy => vacancy.toJSON());
    };*/
    Sequelize.query('select * from news`').success(function(rows) {
        this.body = rows;
        //console.log(JSON.stringify(rows))
    })
};

