
//Dependencies ======

var express = require('express');

var bodyParser = require('body-parser');

var http = require('http');

var Config = require('./config.js')();

var Models = require('./models.js')(Config);

var app = express();

//App Middleware ======

app.set('token name', Config.App.tokenName);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ type: 'application/json' }));

app.use(function(req, res, next) {

	res.header('Access-Control-Allow-Origin', '*');
	next();

});

//API ======

	//Authentication ===

	var requireAuthentication = function(req, res, next) {

		var token = req.get( app.get('token name') );

		if (!token) { 
			return res.status(401).send({ message: app.get('token name') + ' header was not found!' }); 
		}

		Models.Users.getByToken(token, function(response) {

			if (!response.data.user) {
				return res.status(401).send({ statusCode: 401, message: app.get('token name') + ' token has been invalidated! Token could have expired, but more likely the associated user does not exist anymore.' }); 
			}

			req.user = response.data.user;
			next();

		});

	};

	app.post('/v1/register', function(req, res) {

		Models.Users.getByUsername(req.param('username'), function(response) {

			if (response.data.user) {
				return res.status(400).send({ statusCode: 400, message: 'Username already registered! Please select another username.' }); 
			}

			Models.Users.createWithUsernameAndPassword(req.param('username'), req.param('password'), function(response) {
			
				res.status(response.statusCode).send(response);
			
			});

		});

	});

	app.post('/v1/login', function(req, res) {

		Models.Users.getByUsernameAndPassword(req.param('username'), req.param('password'), function(response) {

			if (!response.data.user) {
				response.message = 'Could not find that user! Please check username and password';
				return res.status(response.statusCode).send(response);
			}

			req.user = response.data.user;

			Models.Users.assignTokenToUser(req.user.id, function(response) {

				if (response.error) {
					return res.status(response.statusCode).send(response);
				}

				response.data.user = req.user;
				response.data.token = {
					header: app.get('token name'),
					value: response.data.token
				};
				response.message = 'You are now logged in!';
				res.status(response.statusCode).send(response);

			});

		});

	});

	app.use('/v1/*', requireAuthentication);

	//API - Users

	var routerUserApi = express.Router();

	routerUserApi.route('/user')

		.get(function(req, res) {
		
			res.status(200).send({ data: { user: req.user } });
		
		})

		.put(function(req, res) {
			
			/*
			We have strict parameter whitelisting in our users model -- this is
			why we can safely pass the entire req.body in our model method!
			*/

			Models.Users.update(req.user.id, req.body, function(response) {

				res.status(response.statusCode).send(response);

			});
		
		})

		.delete(function(req, res) {

			Models.Users.delete(req.user.id, function(response) {

				res.status(response.statusCode).send(response);

			});

		});

	app.use('/v1', routerUserApi);

//Starting our app ======

app.listen(Config.Express.port, function() {

	console.log('Running on port ' + Config.Express.port);

});
