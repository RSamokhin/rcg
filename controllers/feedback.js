
var parse = require('co-body');

var models = require("../models");
var Sequelize = require('sequelize');

module.exports.list = function * () {
    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);
    var feedbacks = yield models.Feedback.findAll({
        limit: count,
        offset: start
    });
    this.body = feedbacks.map(feedback => feedback.toJSON());
};

module.exports.update = function * (feedbackId) {

    var data = yield parse(this);

    var object = yield models.Feedback.findOne({
        where:{
            id: feedbackId | 0
        }
    });

    if (object === null)
    {
        this.status = 404;
        return;
    }

    if (data['name'] !== undefined)
        object.name = data['name'].toString();
    if (data['email'] !== undefined)
        object.email = data['email'].toString();
    if (data['phone'] !== undefined)
        object.phone = data['phone'].toString();
    if (data['text'] !== undefined)
        object.text = data['text'].toString();
    if (data['status'] !== undefined)
        object.status = data['status'].toString();

    object.save();

    this.body = object.toJSON();
};

module.exports.add = function * () {

    var data = yield parse(this);

    var name = data['name'] || '';
    var email = data['email'] || '';
    var phone = data['phone'] || '';
    var text = data['text'] || '';
    var status = data['status'] || '';
    var replyComment = data['replyComment'] | 0;

    var feedback = yield models.Feedback.create({
        name: '' + name,
        email: '' + email,
        phone: '' + phone,
        text: '' + text,
        status: '' + status,
        replyComment: replyComment
    });
    this.status = 200;
    this.body = feedback.toJSON()
};
