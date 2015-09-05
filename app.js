
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var co = require('co');
//var serveStatic = require('koa-serve-static');
var serveStatic = require('koa-static');
var jwt = require('koa-jwt');

var app = module.exports = koa();

var cfg = require("./config");

var models = require("./models");

var news = require('./controllers/news');
var vacancy = require('./controllers/vacancy');
var replies = require('./controllers/replies');
var images = require('./controllers/images');
var token = require('./controllers/token');
var common = require('./controllers/common');


var feedbacks = require('./controllers/feedback');


app.use(serveStatic('web/build/'));

app.use(jwt({ secret: cfg.token.secret }));

app.use(route.get('/news', news.listNews));
app.use(route.get('/vacancy', vacancy.listVacancies));
app.use(route.get('/news/:id', news.show));
app.use(route.post('/news/:id', news.updateNews));
app.use(route.del('/news/:id', common.del(models.News)));
app.use(route.del('/vacancy/:id', common.del(models.News)));
app.use(route.get('/news/:id/comments', news.showComments));
app.use(route.put('/news', news.add));
app.use(route.get('/vacancy/replies', vacancy.listReplies));
app.use(route.get('/vacancy/:id', vacancy.show));
app.use(route.post('/vacancy/:id', vacancy.updateVacancy));
app.use(route.get('/vacancy/:id/replies', vacancy.listVacancyReplies));
app.use(route.put('/vacancy/:id/replies', vacancy.addVacancyReply));
app.use(route.get('/replies/:id', replies.showReply));
app.use(route.del('/replies/:id', common.del(models.NewsComments)));
app.use(route.post('/replies/:id', replies.updateReply));
app.use(route.put('/vacancy', vacancy.add));
app.use(route.get('/feedbacks', feedbacks.list));
app.use(route.put('/feedbacks', feedbacks.add));
app.use(route.post('/feedbacks/:feedbackId', feedbacks.update));
app.use(route.del('/feedbacks/:id', common.del(models.Feedback)));

app.use(route.post('/images/', images.add));
app.use(route.get('/images/:fname', images.get));

app.use(route.post('/token', token.getToken));


if (!module.parent) 
{
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