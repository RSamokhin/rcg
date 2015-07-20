
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();
var co = require('co');

var news = require('./controllers/news');
var vacancy = require('./controllers/vacancy');
var replies = require('./controllers/replies');
var feedbacks = require('./controllers/feedback');

app.use(route.get('/news', news.listNews));
app.use(route.get('/vacancy', vacancy.listVacancies));
app.use(route.get('/news/:id', news.show));
app.use(route.post('/news/:id', news.updateNews));
app.use(route.post('/vacancy/:id', news.updateNews));
app.use(route.get('/news/:id/comments', news.showComments));
app.use(route.put('/news', news.add));
app.use(route.get('/vacancy/replies', vacancy.listReplies));
app.use(route.get('/vacancy/:id', vacancy.show));
app.use(route.get('/vacancy/:id/replies', vacancy.listVacancyReplies));
app.use(route.put('/vacancy/:id/replies', vacancy.addVacancyReply));
app.use(route.get('/replies/:id', replies.showReply));
app.use(route.post('/replies/:id', replies.updateReply));
app.use(route.put('/vacancy', vacancy.add));

app.use(route.get('/feedbacks', feedbacks.list));
app.use(route.put('/feedbacks', feedbacks.add));
app.use(route.post('/feedbacks/:feedbackId', feedbacks.update));

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