
var parse = require('co-body');

var models = require("../models");

module.exports.list = function() {
    return function * () {
        var start = this.query['start'] | 0;
        var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
        count = Math.max(count, 1);
        start = Math.max(start, 0);
        var news = yield models.News.findAll({
            limit: count,
            offset: start,
            where: {
                is_vacancy: 0,
                is_project: 0,
                is_draft:0
            }
        });
        this.body = news.map(news => news.toJSON());
    };
};









/*
module.exports.show = function() {

    return function * (newsId) {

        var news = yield models.News.findOne({
            where: {
                id: newsId | 0
            }
        });
        if (news === null)
        {
            this.status = 404;
            return;
        }
        this.body = news.toJSON();
    };
};*/
/*
module.exports.add = function(isVacancy) {
    isVacancy = !!isVacancy;

    return function * () {

        var news = yield parse(this);

        var text = news['text'] || '';
        var title = news['title'] || '';
        var shortText = news['shortText'] || '';

        yield models.News.create({
            id: (Math.random() * 100000) | 0,
            authorId: '654654',
            dateCreated: new Date(),
            datePublished: new Date(),
            title: '' + title,
            text: '' + text,
            shortText: '' + shortText,
            isVacancy: isVacancy
        });
        this.status = 200;
    };
};
    */