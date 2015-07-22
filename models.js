
module.exports = function(Config) {

	//Dependencies ======

	var r = require('rethinkdb');

	var crypto = require('crypto');

	var _ = require('underscore');

	//Helper functions ======

	var hashPassword = function(password) {

		var salt = Config.App.salt;

		return crypto.createHash('md5').update(password + salt).digest('hex');

	};

	var randomString = function() {

		return crypto.randomBytes(20).toString('hex');

	};

	var connect = function(connected) {

		r.connect(Config.Rethink, function(err, connection) {

			if (err) { throw err; }

			connected(connection);

		});

	};

	var handleInternalError = function(error, onComplete) {

		if (!error) { return false; }

		console.error(error);
		
		onComplete({ 
			statusCode: 500, 
			message: 'Something went wrong server-side.', 
			error: error 
		});

		return true;

	};

	//Model methods ======

	var Models;

	Models = {

		Users: {

			assignTokenToUser: function(user_id, onComplete) {
				connect(function(connection) {
					var user_token = randomString();
					r.table('users').get(user_id).update({ token: user_token }).run(connection, function(err, result) {

						if (handleInternalError(err, onComplete)) { return; }

						return onComplete({ 
							statusCode: 200, 
							message: 'User has been assigned a new token!', 
							data: { 
								token: user_token 
							} 
						}); 
					})
				})
			},

			createWithUsernameAndPassword: function(user_username, user_password, onComplete) {
				connect(function(connection) {
					r.table('users').insert({ username: user_username, password: hashPassword(user_password) }).run(connection, function(err, result) {

						if (handleInternalError(err, onComplete)) { return; }

						return onComplete({ 
							statusCode: 200, 
							message: 'User has been registered!', 
							data: { 
								database: result, 
								user: { 
									username: user_username
								}
							}
						});
					})
				})
			},

			delete: function(user_id, onComplete) {
				connect(function(connection) {
					r.table('users').get(user_id).delete().run(connection, function(err, result) {
						
						if (handleInternalError(err, onComplete)) { return; }

						return onComplete({ 
							statusCode: 200, 
							message: 'User has been removed!', 
							data: { 
								database: result 
							} 
						});
					})
				})
			},

			getByToken: function(user_token, onComplete) {
				connect(function(connection) {
					r.table('users').filter({ token: user_token }).run(connection, function(err, cursor) {
						
						if (handleInternalError(err, onComplete)) { return; }

						cursor.toArray(function(err, result) {
							
							if (handleInternalError(err, onComplete)) { return; }

							//For good security practice, we return our user without its hashed password or token
							var user = _.omit(result[0], ['password', 'token']);

							if (_.isEmpty(user)) {
								return onComplete({ 
									statusCode: 404, 
									message: 'User was not found!', 
									data: {} 
								});
							}

							return onComplete({ 
								statusCode: 200, 
								message: 'User found by token!', 
								data: { 
									user: user 
								} 
							});
						})
					})
				})
			},

			getByUsername: function(user_username, onComplete) {
				connect(function(connection) {
					r.table('users').filter({ username: user_username }).run(connection, function(err, cursor) {
						
						if (handleInternalError(err, onComplete)) { return; }

						cursor.toArray(function(err, result) {
							
							if (handleInternalError(err, onComplete)) { return; }

							//For good security practice, we return our user without its hashed password or token
							var user = _.omit(result[0], ['password', 'token']);

							if (_.isEmpty(user)) {
								return onComplete({ 
									statusCode: 404, 
									message: 'User was not found!', 
									data: {} 
								});
							}

							return onComplete({ 
								statusCode: 200, 
								message: 'User found by username!', 
								data: { 
									user: user 
								} 
							});
						})
					})
				})
			},

			getByUsernameAndPassword: function(user_username, user_password, onComplete) {
				connect(function(connection) {
					r.table('users').filter({ username: user_username, password: hashPassword(user_password) }).run(connection, function(err, cursor) {
						
						if (handleInternalError(err, onComplete)) { return; }

						cursor.toArray(function(err, result) {
							
							if (handleInternalError(err, onComplete)) { return; }

							//For good security practice, we return our user without its hashed password or token
							var user = _.omit(result[0], ['password', 'token']);

							if (_.isEmpty(user)) {
								return onComplete({ 
									statusCode: 404, 
									message: 'User was not found!', 
									data: {} 
								});
							}

							return onComplete({ 
								statusCode: 200, 
								message: 'User found by username and password!', 
								data: { 
									user: user 
								} 
							});
						})
					})
				})
			},

			update: function(user_id, args, onComplete) {
				
				var user_args = this.whitelist(args);

				connect(function(connection) {

					//Make sure we're not overwriting our token on user info update
					user_args = _.omit(user_args, ['token']);

					//If password has been passed, we make sure to hash our value
					if (user_args.password) { user_args.password = hashPassword(user_args.password); }

					if (_.isEmpty(user_args)) { 					
						return onComplete({ 
							statusCode: 200, 
							message: 'Nothing to update.', 
							data: {} 
						});
					}

					r.table('users').get(user_id).update(user_args).run(connection, function(err, result) {
						
						if (handleInternalError(err, onComplete)) { return; }

						return onComplete({ 
							statusCode: 200, 
							message: 'User has been updated!', 
							data: { 
								user: user_args 
							} 
						});
					})
				})
			},

			whitelist: function(user_args) {
				return _.pick(user_args, [ 'id', 'username', 'password', 'token', 'email' ]);
			}

		}

	};

	return Models;

};
