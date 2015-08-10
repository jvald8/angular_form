var mongo = require('mongodb');
// Require mongodb module

var Server = mongo.Server;
// Fetch mongo server object

var Db = mongo.Db;
// Fetch mongo database object

var server = new Server('localhost', 27017, {auto_reconnect:true});
// Create an instance of a mongo server object that reads on localhost:27017, which
// autoreconnects if the server connection is lost.

var db = new Db('usersdb', server);
// Create an instance of a mongo db object, call is notes, and open it using the server object.

// Open the notes db connection to the server with a callback that asks if there's an error
// If there's no error, console log a success message, then check to see if that particular db exists.
// If that db exists, then move on. else create a new database named notes and populate it with some data

// If there's an error, say that the connection is down, or couldn't connect.
db.open(function(err, db) {
  if(!err) {
    console.log('connection to the database is a go');
    db.collection('users', {strict:true}, function(err, collection) {
      if(err) {
        console.log('Couldn\'t find the db, let\'s create it and populate it with data');
        populateDb();
      }
    });
  }
});

exports.findUser = function(request, response) {
  db.collection('users', function(err, collection) {
    collection.find().toArray(function(err, items) {
      console.log(items)
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.send(items);
    });
  });
};

exports.findByIdOrAdd = function(request, response) {

  var id = request.id;
  console.log('Finding user # ' + id);

  db.collection('users', function(err, collection) {
    collection.findOne({'id':id}, function(err, item) {
      if(err) {
        response(err)
      } else if(item) {
        console.log(JSON.stringify(item))
        response.setHeader('Access-Control-Allow-Origin', '*');
        response(null, JSON.stringify(item));
      } else {

        var user = request;
        collection.insert({'id': user.id, 'email':user.email, 'name': user.displayName}, {safe:true}, function(err, result) {
          if(err) {
            console.log('theres been an error updating the user: ' + err);
            response.setHeader('Access-Control-Allow-Origin', '*');
            response({'error':'theres been an error'});
          } else {
            console.log('' + result + 'documents updated');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response(null, result)
          }
        });
      }
    });
  });
};

exports.addUser = function(request, response) {
  var user = request.body;
  console.log(JSON.stringify(user));
  db.collection('users', function(err, collection) {
    collection.insert({'id': 1, 'email':user.email, 'password':user.password}, {safe:true}, function(err, result) {
      if(err) {
        console.log('theres been an error updating the user: ' + err);
        response.send({'error':'theres been an error'});
      } else {
        console.log(result + 'documents updated');
        response.send(user);
      }
    });
  });
}

exports.updateUser = function(request, response) {
  var user = request.body;
  console.log(JSON.stringify(user));
  db.collection('users', function(err, collection) {
    collection.update({'id':1}, user, {safe:true}, function(err, result) {
      if(err) {
        console.log('theres been an error updating user: ' + err);
        response.send({'error':'theres been an error'});
      } else {
        console.log(result + 'documents updated');
        response.send(user);
      }
    });
  });
}


var populateDb = function() {
  var users = [
    {
        id:1,
        email:'',
        name: ''
    }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {
          if(err) {
            console.log(err)
          }
        });
    });

};
