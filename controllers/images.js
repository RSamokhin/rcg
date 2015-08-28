var fs = require('fs');
var os = require('os');
var path = require('path');
var parse = require('co-busboy');




var Sequelize = require('sequelize');

module.exports.add = function *(next){
    // ignore non-POSTs
    if ('POST' != this.method) return yield next;

    // multipart upload
    var parts = parse(this);
    var part;

    while (part = yield parts) {
        var stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
        part.pipe(stream);
        console.log('uploading %s -> %s', part.filename, stream.path);

        this.body = 'uploading %s -> %s', part.filename, stream.path;
    }

};
