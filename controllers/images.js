var fs = require('fs');
var path = require('path');
var parse = require('co-busboy');

var allowed = ['jpg', 'png', 'gif'];

module.exports.add = function *(next){
   // if (this.is('image/*')) {
        var parts = parse(this);
        var part;
        while (part = yield parts) {

            var ext = path.extname(part.filename).slice(1);
            if (allowed.indexOf(ext) === -1)
            {
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
                path : '/' + stream.path
            };
        }
 /*   } else {
        this.body =this {
            status: 'ERROR',
            error : 'unsupported type'
        };
    }
     */
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
    var fs = require('fs');
    var readStream = fs.createReadStream('images/' + fname);
    this.body = readStream;
};