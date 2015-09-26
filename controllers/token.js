
var parse = require('co-body');
var jwt = require('koa-jwt');

var models = require("../models");
var cfg = require("../config");

module.exports.getToken = function * ()
{
    var data = yield parse(this);
    var phone = data['phone'];
    var password = data['password'];
    if (phone == undefined || password == undefined)
    {
        this.status = 404;
        return;
    }

    var user = yield models.User.findOne({
        where: {
            phone: phone
        }
    });
    if (user === null || user.encryptPassword(password) !== user.pwdhash)
    {
        this.status = 400;
        this.body = {
            'error': 'Phone or password invalid!'
        };
        return;
    }

    this.body = {
        token: jwt.sign({
                user: user.phone
            }, cfg.token.secret, {
                expiresInSeconds: cfg.token.expires
            })
    };

    this.status = 200;
};


module.exports.checToken = function * ()
{
    var authorized = false;

    if (!this.header.authorization)
    {
        this.body = { authorized: false };
        return;
    }
    var parts = this.header.authorization.split(' ');
    if (parts.length !== 2)
    {
        this.body = { authorized: false };
        return;
    }
    var scheme = parts[0];

    if (!/^Bearer$/i.test(scheme))
    {
        this.body = { authorized: false };
        return;
    }
    var token = parts[1];
    try
    {
        yield jwt.verify(token, cfg.token.secret);
    }
    catch(e)
    {
        this.body = { authorized: false };
        return;
    }
    this.body = { authorized: true };
};

// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiNjU0NjU0IiwiaWF0IjoxNDQxNDc1MDE4LCJleHAiOjE0NDIwNzk4MTh9.Iyl_EHBfwC6KoBrgN_CkYoTN-twkURPI-jNMkB3bGuw