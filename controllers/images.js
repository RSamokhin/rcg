var fs = require('fs'),
    path = require('path'),
    parse = require('co-busboy'),
    cfg = require('./../config.js');

var allowed = ['jpg', 'png', 'gif'];

module.exports.add = function *(next){
    var parts = parse(this);
    var part;
    while (part = yield parts) {

        var ext = path.extname(part.filename).slice(1);
        if (allowed.indexOf(ext) === -1) {
            this.body = {
                status: 'ERROR',
                error : 'unsupported type'
            };
            return;
        }
        var stream = fs.createWriteStream(path.join('images', guid()) + '.' + part.filename.split('.').slice(-1).toString());
        part.pipe(stream);
        this.body = {
            status: 'OK',
            path : cfg.url + stream.path
        };
    }
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
};
module.exports.get = function *(fname){
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(fname.split('.').slice(-2,-1))) {
        var fs = require('fs'),
            readStream = fs.createReadStream('images/' + fname);
        this.body = readStream;
    }
};