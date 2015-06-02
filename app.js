
var test = require('./controllers/test');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();

app.use(route.get('/', test.home));

app.use(serve(path.join(__dirname, 'public')));

if (!module.parent) 
{
	app.listen(1337);
	console.log('listening on port 1337');
}