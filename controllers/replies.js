
var parse = require('co-body');

var models = require("../models");
var Sequelize = require('sequelize');

module.exports.showReply = function * (vacancyId) {

    var reply = yield models.NewsComments.findOne({
        where:{
            id: vacancyId | 0
        }
    });

    if (reply === null)
    {
        this.status = 404;
        return;
    }
    this.body = reply.toJSON();
};

module.exports.updateReply = function * (vacancyId) {

    var replyData = yield parse(this);

    var reply = yield models.NewsComments.findOne({
        where:{
            id: vacancyId | 0
        }
    });

    if (reply === null)
    {
        this.status = 404;
        return;
    }

    if (replyData['userId'] !== undefined)
        reply.userId = replyData['userId'].toString();
    if (replyData['text'] !== undefined)
        reply.text = replyData['text'].toString();
    if (replyData['commentStatus'] !== undefined)
        reply.commentStatus = replyData['commentStatus'].toString();
    if (replyData['adminComment'] !== undefined)
        reply.adminComment = replyData['adminComment'].toString();
    if (replyData['commentType'] !== undefined)
        reply.commentType = replyData['commentType'].toString();
    if (replyData['timestamp'] !== undefined)
        reply.timestamp = new Date(replyData['timestamp']);

    reply.save();

    this.body = reply.toJSON();
};
