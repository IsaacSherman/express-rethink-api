
module.exports = function() {

	return {

		App: {
			tokenName: 'X-App-API-Token',
			salt: 'abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' //for security, please change for your project!
		},

		Express: {
			port: 8080
		},

		Rethink: {
			host: 'localhost',
			port: 28015,
			db: 'app'
		}

	}

};
