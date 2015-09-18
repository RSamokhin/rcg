
var co = require('co');

var apn = require('apn');

var models = require('./models');
var cfg = require('./config');

var options = {
    cert: cfg.apns.cert,
    key: cfg.apns.key
};

var pushToDevices = function(message, opt_payload)
{
    co(function * (){
        var devices = yield models.Devices.findAll();
        if (!devices.length)
            return;

        var apnConnection = new apn.Connection(options);
        var note = new apn.Notification();
        note.alert = message;
        if (opt_payload !== undefined)
            note.payload = opt_payload;

        devices.forEach(function(device)
        {
            var apnDevice = new apn.Device(device.token);
            apnConnection.pushNotification(note, apnDevice);
        })
    });
};

module.exports.pushToDevices = pushToDevices;
