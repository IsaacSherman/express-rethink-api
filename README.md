# express-rethink-api
Super fast way to getting a token authenticated JSON RESTful API up and going. Uses Node.js, Express.js, and RethinkDB.

## Notes
* RethinkDB's administration panel typically runs on port 8080. However, HTTP proxies typically use 8080, and so we've configured RethinkDB's admin panel to run on port 9090.
* Remember to create your database "app" with a table called "users"!
* Not really happy with having status codes in models.js, instead of server.js. This was an experiment, and I'll most likely move all of the status codes back to server.js. (I felt like the code is more DRY this way, but I can't shake the guilty feeling.)
