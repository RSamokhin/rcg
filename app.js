
var news = require('./controllers/news');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var co = require('co');
var sql = require('co-mssql');

app.use(route.get('/news', news.list(false)));
app.use(route.get('/news/:id', news.show(false)));
app.use(route.put('/news', news.add(false)));
app.use(route.get('/vacancy', news.list(true)));
app.use(route.get('/vacancy/:id', news.show(true)));
app.use(route.put('/vacancy', news.add(true)));

app.use(serve(path.join(__dirname, 'public')));

if (!module.parent) 
{
    var config = require('./config');

    co(function * (){

        try
        {
            yield sql.connect(config.database);
        }
        catch(e)
        {
            console.log(e.message);
            return;
        }

        app.listen(1337);
        console.log('listening on port 1337');
    });
}