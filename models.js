
module.exports = function(Config) {

	//Dependencies ======

	var r = require('rethinkdb');

	//Helper functions ======

	var connect = function(connected) {

		r.connect(Config.Rethink, function(err, connection) {

			if (err) { throw err; }

			connected(connection);

		});

	};

	//Model methods ======

	var Models;

	Models = {

		Test: {

			create: function(args, success) {
				connect(function(connection) {
					r.table('users').insert(args).run(connection, function(err, result) {
						if (err) { return console.error(err) }
						if (success) { success(result) }
					})
				})
			},

			get: function(user_id, success) {
				connect(function(connection) {
					r.table('users').get(user_id).run(connection, function(err, result) {
						if (err) { return console.error(err) }
						if (success) { success(result) }
					})
				})
			},

			getAll: function(success) {
				connect(function(connection) {
					r.table('users').run(connection, function(err, cursor) {
						if (err) { return console.error(err) }

						cursor.toArray(function(err, result) {
							if (err) { return console.error(err) }
							if (success) { success(result) }
						})
					})
				})
			},

			update: function(user_id, args, success) {
				connect(function(connection) {
					r.table('users').get(user_id).update(args).run(connection, function(err, result) {
						if (err) { return console.error(err) }
						if (success) { success(result) }
					})
				})
			},

			delete: function(user_id, success) {
				connect(function(connection) {
					r.table('users').get(user_id).delete().run(connection, function(err, result) {
						if (err) { return console.error(err) }
						if (success) { success(result) }
					})
				})
			}

		}

	};

	return Models;

};
