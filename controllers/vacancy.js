
var parse = require('co-body');

var models = require("../models");
var Sequelize = require('sequelize');

module.exports.listVacancies = function * () {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);

    var vacancies = yield models.News.findAll({
        include: [models.Vacancy],
        limit: count,
        offset: start,
        where: {
            isVacancy: true,
            isProject: false,
            isDraft: false
        }
    });
    this.body = vacancies.map(vacancy => vacancy.toJSON());
};

module.exports.show = function * (vacancyId) {

    var vacancy = yield models.News.findOne({
        where: {
            id: vacancyId | 0,
            isVacancy: true,
            isProject: false,
            isDraft: false
        },
        include: [models.Vacancy]
    });
    if (vacancy === null)
    {
        this.status = 404;
        return;
    }
    this.body = vacancy.toJSON();
};

module.exports.add = function * () {

    var news = yield parse(this);

    var text = news['text'] || '';
    var title = news['title'] || '';
    var shortText = news['shortText'] || '';

    var insertedNews = yield models.News.create({
        id: (Math.random() * 100000) | 0,
        authorId: '654654',
        dateCreated: new Date(),
        datePublished: new Date(),
        title: '' + title,
        text: '' + text,
        shortText: '' + shortText,
        isVacancy: false
    });

    yield insertedNews.createVacancy();

    this.status = 200;
};