
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
					r.table('users').insert(args).run(connection, function(err, results) {
						if (success) { success(results) }
					})
				})
			},

			get: function(user_id, success) {
				connect(function(connection) {
					r.table('users').get(user_id).run(connection, function(err, results) {
						if (success) { success(results) }
					})
				})
			},

			getAll: function(success) {
				connect(function(connection) {
					r.table('users').run(connection, function(err, results) {
						if (success) { success(results) }
					})
				})
			},

			update: function(user_id, args, success) {
				connect(function(connection) {
					r.table('users').get(user_id).update(args).run(connection, function(err, results) {
						if (success) { success(results) }
					})
				})
			},

			delete: function(user_id, success) {
				connect(function(connection) {
					r.table('users').get(user_id).delete().run(connection, function(err, results) {
						if (success) { success(results) }
					})
				})
			}

		}

	};

	return Models;

};
