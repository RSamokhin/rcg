
var parse = require('co-body');

var models = require("../models");
var Sequelize = require('sequelize');

module.exports.add = function * () {

    var data = yield parse(this);

    var token = data['token'] || '';

    var device = yield models.Devices.create({
        token: token.toString(),
        date: new Date()
    });
    this.status = 200;
    this.body = device.toJSON()
};
