
var co = require('co');

var apn = require('apn');

var models = require('./models');
var cfg = require('./config');

var options = {
    cert: cfg.apns.cert,
    key: cfg.apns.key,
    production: false 
};

var pushToDevices = function(message, opt_payload)
{
//    console.log("PUsh", message);
    co(function * (){
        var devices = yield models.Devices.findAll();
        if (!devices.length)
            return;

        var apnConnection = new apn.Connection(options);

 //       var log = function(event, data) {
 //           console.log(arguments)
 //       };

 //       apnConnection.on('error', log.bind(null, 'error'));
 //       apnConnection.on('socketError', log.bind(null, 'socketError'));
 //       apnConnection.on('transmitted', log.bind(null, 'transmitted'));
 //       apnConnection.on('completed', log.bind(null, 'completed'));
 //       apnConnection.on('transmissionError', log.bind(null, 'transmissionError'));


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
