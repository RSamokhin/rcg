
var parse = require('co-body');

var models = require("../models");

module.exports.listNews = function * () {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);
    var news = yield models.News.findAll({
        limit: count,
        offset: start,
        where: {
            isVacancy: false,
            isProject: false,
            isDraft: false
        }
    });
    this.body = news.map(news => news.toJSON());
};

module.exports.show = function * (newsId) {

    var news = yield models.News.findOne({
        where: {
            id: newsId | 0,
            isVacancy: false,
            isProject: false,
            isDraft: false
        }
    });
    if (news === null)
    {
        this.status = 404;
        return;
    }
    this.body = news.toJSON();
};

module.exports.showComments = function * (newsId) {

    var newsComments = yield models.NewsComments.findAll({
        where: {
            newsId: newsId | 0
        }
    });
    this.body = newsComments.map(newsComment => newsComment.toJSON());
};

module.exports.add = function * () {

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
        isVacancy: false
    });
    this.status = 200;
};