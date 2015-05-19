
//Dependencies ======

var express = require('express');

var bodyParser = require('body-parser');

var http = require('http');

var Config = require('./config.js')();

var Models = require('./models.js')(Config);

var app = express();

//App Middleware ======

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ type: 'application/json' }));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

//Routes ======

	//Test Route ===

	var routerTest = express.Router();

	routerTest.route('/')

		.get(function(req, res) {
			Models.Test.getAll(function(users) {
				res.status(200).send(users)
			})
		})

		.post(function(req, res) {
			Models.Test.create({
				name: req.param('name'),
				title: req.param('title')
			}, function(result) {
				res.status(200).send(result)
			})
		});

	routerTest.route('/:user_id')

		.get(function(req, res) {
			Models.Test.get(req.params.user_id, function(user) {
				res.status(200).send(user)
			})
		})

		.put(function(req, res) {
			Models.Test.update(req.params.user_id, req.body, function(result) {
				res.status(200).send(result)
			})
		})

		.delete(function(req, res) {
			Models.Test.delete(req.params.user_id, function(result) {
				res.status(200).send(result)
			})
		});

	app.use('/test', routerTest);

//Starting our app ======

app.listen(Config.Express.port, function() {

	console.log('Running on port ' + Config.Express.port);

});
