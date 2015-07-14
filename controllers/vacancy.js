
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

module.exports.listVacancyReplies = function * (newsId) {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);

    var newsComments = yield models.NewsComments.findAll({
        limit: count,
        offset: start,
        where: {
            newsId: newsId | 0,
            commentType: 'vacancyReply'
        }
    });
    this.body = newsComments.map(newsComment => newsComment.toJSON());
};

module.exports.listReplies = function * (newsId) {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);

    var newsComments = yield models.NewsComments.findAll({
        limit: count,
        offset: start,
        where:{
            commentType: 'vacancyReply'
        },
        include: [
            {
                model: models.News,
                where: {
                    isVacancy: true
                }
            }
        ]
    });
    this.body = newsComments.map(newsComment => newsComment.toJSON());
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
    var rightsJson = news['rightsJson'] || '';
    var title = news['title'] || '';
    var shortText = news['shortText'] || '';
    var picture = news['picture'] || '';
    var previewPicture = news['previewPicture'] || '';
    var authorId = news['authorId'] || '654654';
    var isDraft = news['isDraft'] || false;
    var isProject = news['isProject'] || false;
    var statusId = news['statusId'] || null;
    var categoryId = news['categoryId'] || null;

    var isMale = news['isMale'] || false;
    var workTime = news['workTime'] || '';
    var money = news['money'] || '';
    var city = news['city'] || '';
    var endTime = new Date(news['endTime']);

    var insertedNews = yield models.News.create({
        id: (Math.random() * 100000) | 0,
        authorId: '' + authorId,
        statusId: statusId,
        categoryId: categoryId,
        rightsJson: '' + rightsJson,
        dateCreated: new Date(),
        datePublished: new Date(),
        title: '' + title,
        text: '' + text,
        shortText: '' + shortText,
        picture: '' + picture,
        previewPicture: '' + previewPicture,
        isVacancy: true,
        isProject: isProject,
        isDraft: !!isDraft
    });

    yield insertedNews.createVacancy({
        isMale: isMale,
        endTime: isNaN(endTime) ? new Date() : endTime,
        money: money,
        city: city,
        workTime: workTime
    });

    this.status = 200;
};

module.exports.addVacancyReply = function * (newsId) {

    var replyData = yield parse(this);

    var userId = replyData['userId'] || '';
    var text = replyData['text'] || '';
    var commentStatus = replyData['commentStatus'] || '';
    var adminComment = replyData['adminComment'] || '';
    var commentType = replyData['commentType'] || '';
    var timestamp = new Date(replyData['timestamp']);

    var reply = yield models.NewsComments.create({
        id: (Math.random() * 100000) | 0,
        newsId: newsId | 0,
        userId: userId,
        text: text,
        commentStatus: commentStatus,
        adminComment: adminComment,
        commentType: commentType,
        timestamp: isNaN(timestamp) ? new Date() : timestamp
    });

    this.status = 200;
};