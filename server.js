
//Dependencies ======

var express = require('express');

var bodyParser = require('body-parser');

var http = require('http');

var Models = require('./models.js')();

var app = express();

//App Settings ======

app.set('port', process.env.PORT || 8080);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ type: 'application/json' }));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

//Routes ======

	//Example Route ===

	var routerExample = express.Router();

	routerExample.route('/')

		.get(function(req, res) {
			res.status(200).send({ message: "Hello!" });
		});

	app.use('/', routerExample);

//Starting our app ======

app.listen(app.get('port'), function() {

	console.log('Running on port ' + app.get('port'));

});
