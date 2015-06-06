
var sql = require('co-mssql');

module.exports.list = function * home() {

    var start = this.query['start'] | 0;
    var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
    count = Math.max(count, 1);
    start = Math.max(start, 0);

    var ps = new sql.PreparedStatement();
    ps.input('start', sql.Int);
    ps.input('count', sql.Int);

    yield ps.prepare(
        'SELECT * FROM dbo.news ' +
        'WHERE is_vacancy = 0 ' +
        'ORDER By datecreated ' +
        'OFFSET @start ROWS FETCH NEXT @count ROWS ONLY;');
    var recordset = yield ps.execute({
        start: start,
        count: count
    });
    yield ps.unprepare();

    this.body = recordset;
};

module.exports.show = function * home(newsId) {

    var ps = new sql.PreparedStatement();
    ps.input('newsId', sql.Int);
    yield ps.prepare(
        'SELECT * FROM dbo.news ' +
        'WHERE n_id = @newsId');
    var news = yield ps.execute({
        newsId: newsId | 0
    });
    yield ps.unprepare();

    if (!news.length)
    {
        this.status = 404;
        return;
    }

    this.body = news[0];
};