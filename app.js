
var news = require('./controllers/news');
var vacancy = require('./controllers/vacancy');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var co = require('co');

app.use(route.get('/news', news.listNews));
app.use(route.get('/vacancy', vacancy.listVacancies));
app.use(route.get('/news/:id', news.show));
app.use(route.get('/news/:id/comments', news.showComments));
app.use(route.put('/news', news.add));
app.use(route.get('/vacancy/replies', vacancy.listReplies));
app.use(route.get('/vacancy/:id', vacancy.show));
app.use(route.get('/vacancy/:id/replies', vacancy.listVacancyReplies));
app.use(route.put('/vacancy', vacancy.add));

app.use(serve(path.join(__dirname, 'public')));

if (!module.parent) 
{
    var models = require("./models");

    co(function * (){

        try
        {
            yield models.sequelize.authenticate();
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