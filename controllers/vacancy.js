
var parse = require('co-body');

var models = require("../models");
var Sequelize = require('sequelize');

var common = require("./common");

var apns = require('../apns.js');

module.exports.listVacancies = function * () {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);

    var where = common.createWhere(models.News, this.query);
    where['isVacancy'] = true;
    where['isProject'] = false;
    where['isDraft'] = false;

    var vacancies = yield models.News.findAll({
        include: [models.Vacancy],
        limit: count,
        offset: start,
        where: where,
        order: [['datepubliched', 'DESC']]
    });
    this.body = vacancies.map(vacancy => vacancy.toJSON());
};

module.exports.listVacancyReplies = function * (newsId) {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);

    var where = common.createWhere(models.NewsComments, this.query);
    where['newsId'] = newsId | 0;
    where['commentType'] = 'vacancyReply';

    var newsComments = yield models.NewsComments.findAll({
        limit: count,
        offset: start,
        where: where,
        order: [['timestamp', 'DESC']]
    });
    this.body = newsComments.map(newsComment => newsComment.toJSON());
};

module.exports.listReplies = function * (newsId) {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);

    var where = common.createWhere(models.NewsComments, this.query);
    where['commentType'] = 'vacancyReply';

    var newsComments = yield models.NewsComments.findAll({
        limit: count,
        offset: start,
        where: where,
        order: [['timestamp', 'DESC']],
        include: [
            {
                model: models.News,
                where: {
                    isVacancy: true
                },
                include: [models.Vacancy]
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

    var isMale = news['isMale'] | 0;
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

    this.body = insertedNews.toJSON();
    this.status = 200;

    if (news['sendAlert'] && news['sendAlert'] !== 'false')
        apns.pushToDevices('У нас появилась новая вакансия!');
};

module.exports.updateVacancy = function * (id) {

    var data = yield parse(this);

    var news = yield models.News.findOne({
        where:{
            id: id | 0,
            isVacancy: true
        },
        include: [models.Vacancy]
    });

    if (news === null)
    {
        this.status = 404;
        return;
    }

    if (data['authorId'] !== undefined)
        news.authorId = data['authorId'].toString();
    if (data['text'] !== undefined)
        news.text = data['text'].toString();
    if (data['title'] !== undefined)
        news.title = data['title'].toString();
    if (data['rightsJson'] !== undefined)
        news.rightsJson = data['rightsJson'].toString();
    if (data['shortText'] !== undefined)
        news.shortText = data['shortText'].toString();
    if (data['picture'] !== undefined)
        news.picture = data['picture'].toString();
    if (data['previewPicture'] !== undefined)
        news.previewPicture = data['previewPicture'].toString();
    if (data['isDraft'] !== undefined)
        news.isDraft = !!data['isDraft'] && data['isDraft'] !== 'false';
    if (data['isProject'] !== undefined)
        news.isProject = !!data['isProject'] && data['isProject'] !== 'false';
    if (data['isVacancy'] !== undefined)
        news.isVacancy = !!data['isVacancy'] && data['isVacancy'] !== 'false';

    var vacancy = news.Vacancy;
    if (data['isMale'] !== undefined)
        vacancy.isMale = data['isMale'] | 0;
    if (data['money'] !== undefined)
        vacancy.money = data['money'].toString();
    if (data['city'] !== undefined)
        vacancy.city = data['city'].toString();
    if (data['workTime'] !== undefined)
        vacancy.workTime = data['workTime'].toString();
    if (data['endTime'] !== undefined)
    {
        var endTime = new Date(data['endTime']);
        vacancy.endTime = isNaN(endTime) ? new Date() : endTime;
    }

    news.save();
    vacancy.save();

    this.body = news.toJSON();

    if (data['sendAlert'] && data['sendAlert'] !== 'false')
        apns.pushToDevices('У нас обновилась вакансия!');
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
    this.body = reply.toJSON();
};
