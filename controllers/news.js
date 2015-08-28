
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

module.exports.deleteNews = function * (newsId) {

    var news = yield models.News.findOne({
        where: {
            id: newsId | 0,
            isVacancy: false
        }
    });
    if (news === null)
    {
        this.status = 404;
        return;
    }
    yield news.destroy();
    this.status = 200;
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
    var rightsJson = news['rightsJson'] || '';
    var title = news['title'] || '';
    var shortText = news['shortText'] || '';
    var picture = news['picture'] || '';
    var previewPicture = news['previewPicture'] || '';
    var authorId = news['authorId'] || '654654';
    var isDraft = (news['isDraft'] && news['isDraft'] !== 'false') || false;
    var isProject = (news['isProject'] && news['isProject'] !== 'false') || false;
    var statusId = (news['statusId'] | 0) || null;
    var categoryId = (news['categoryId'] | 0) || null;

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
        isVacancy: false,
        isProject: isProject,
        isDraft: !!isDraft
    });
    this.status = 200;
    this.body = insertedNews.toJSON();
};

module.exports.updateNews = function * (newsId) {

    var data = yield parse(this);

    var news = yield models.News.findOne({
        where:{
            id: newsId | 0
        }
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

    news.save();

    this.body = news.toJSON();
};
