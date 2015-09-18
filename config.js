var cfg = {
    'database': {
        server: 'qn177cadic.database.windows.net',
        user: 'rsamokhin',
        password: 'Qsx159357!',
        database: 'rcg',
        options: {
            encrypt: true
        }
    },
    token: {
        secret: 'asd23blkmsldkjhnwisdignaoiv hb',
        expires: 7 * 24 * 60 * 60 // 7 дней
    },
    apns: {
        cert: __dirname + '/cert.pem',
        key: __dirname + '/key.pem'
    }
};
module.exports = cfg;