
var sql = require('co-mssql');
var parse = require('co-body');

module.exports.list = function(isVacancy) {
    isVacancy = !!isVacancy;

    return function * () {

        var start = this.query['start'] | 0;
        var count = this.query['count'] !== undefined ? (this.query['count'] | 0) : 10;
        count = Math.max(count, 1);
        start = Math.max(start, 0);

        var ps = new sql.PreparedStatement();
        ps.input('start', sql.Int);
        ps.input('count', sql.Int);
        ps.input('isVacancy', sql.Bit);

        yield ps.prepare(
            'SELECT * FROM dbo.news ' +
            'WHERE is_vacancy = @isVacancy ' +
            'ORDER By datecreated ' +
            'OFFSET @start ROWS FETCH NEXT @count ROWS ONLY;');
        var recordset = yield ps.execute({
            start: start,
            count: count,
            isVacancy: isVacancy
        });
        yield ps.unprepare();

        this.body = recordset;
    };
};

module.exports.show = function(isVacancy) {
    isVacancy = !!isVacancy;

    return function * (newsId) {

        var ps = new sql.PreparedStatement();
        ps.input('newsId', sql.Int);
        ps.input('isVacancy', sql.Bit);
        yield ps.prepare(
            'SELECT * FROM dbo.news ' +
            'WHERE n_id = @newsId AND is_vacancy = @isVacancy');
        var news = yield ps.execute({
            newsId: newsId | 0,
            isVacancy: isVacancy
        });
        yield ps.unprepare();

        if (!news.length)
        {
            this.status = 404;
            return;
        }

        this.body = news[0];
    };
};

module.exports.add = function(isVacancy) {
    isVacancy = !!isVacancy;

    return function * () {

        var news = yield parse(this);

        var text = news['text'] || '';
        var title = news['title'] || '';
        var shortText = news['short_text'] || '';

        var ps = new sql.PreparedStatement();
        ps.input('newsId', sql.Int);
        ps.input('authorId', sql.VarChar(50));
        ps.input('dateCreated', sql.DateTime2(0));
        ps.input('datePubliched', sql.DateTime2(0));
        ps.input('title', sql.Text);
        ps.input('text', sql.Text);
        ps.input('shortText', sql.Text);
        ps.input('isVacancy', sql.Bit);
        yield ps.prepare(
            'INSERT rcg.dbo.news ' +
            '(n_id, author_id, datecreated, datepubliched, title, text, short_text, is_vacancy) ' +
            'VALUES (@newsId, @authorId, @dateCreated, @datePubliched, @title, @text, @shortText, @isVacancy)');
        try {
            yield ps.execute({
                newsId: (Math.random() * 100000) | 0,
                authorId: '654654',
                dateCreated: new Date(),
                datePubliched: new Date(),
                title: '' + title,
                text: '' + text,
                shortText: '' + shortText,
                isVacancy: isVacancy
            });
            this.status = 200;
        }
        catch (e) {
            this.status = 500;
            console.log(e.message);
        }
        finally {
            yield ps.unprepare();
        }
    };
};