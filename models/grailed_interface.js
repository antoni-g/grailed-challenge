const waterfall = require('async-waterfall');
const sqlite3 = require('sqlite3').verbose();
const queries = require('./queries.js'); 

/*
	Write a function that finds all users with disallowed usernames. 
	Disallowed usernames can be found in the `disallowed_usernames` table.
*/
var disallowed_usernames = function(name, finalCB) {
  waterfall([
    // first instantiate the db
    function(callback) {
      _instantiateDB(name,(err,db) => {
        callback(err,db)
      });
    },
    // then submit the query
    function(db,callback) {
      const query = queries.select_matches('users', 'disallowed_usernames', 'username',' invalid_username');
      db.all(query, (err, rows) => {
        callback(err,db,rows);
      });
    },
    // close the db
    function(db,rows,callback) {
      _closeDB(db, (err) => {
        callback(err,rows)
      });
    }
  ], function(err, result) {
    // finally, pass over the result
    finalCB(err,result);
  });
}

/*
	Write a function that resolves all username collisions. 
	E.g., two users with the username `foo` should become `foo` and `foo1`. 
	The function accepts an optional "dry run" argument that will print the affected rows to the console, not commit the changes to the db.
*/
var collision_resolution = function(name, dryRun, finalCB) {
  _collisionResolution(name, dryRun, 'username', finalCB);
}

/*
	Write a function that resolves all disallowed usernames. 
	E.g., `grailed` becomes `grailed1`. 
	The function accepts an optional "dry run" argument that will print the affected rows to the console, not commit the changes to the db.
*/
var disallowed_collision_resolution = function(name, dryRun, finalCB) {
  _collisionResolution(name, dryRun, 'invalid_username', finalCB);
}

// since both questions 2 and 3 are the same operation on different data sets
// have them wrap the same method with a boolean argument to resolve which dataset to operate on
function _collisionResolution(name, dryRun, dataSet, finalCB) {
  waterfall([
    // first instantiate the db
    function(callback) {
      _instantiateDB(name,(err,db) => {
        callback(err,db)
      });
    },
    // return all duplicate rows
    function(db,callback) {
      // case logic
      let targetQuery;
      switch(dataSet) {
        case 'username': 
          targetQuery = queries.select_duplicates('users','username');
          break;
        case 'invalid_username':
          targetQuery = queries.select_matches('users','disallowed_usernames','username','invalid_username');
          break;
        default:
          callback('An invalid dataSet argument has been passed for collision resolution');
      }
      db.all(targetQuery, (err, rows) => {
        callback(err,db,rows,targetQuery);
      });
    },
    // find the set of [duplicates][*] for potential renaming collsions
    function(db,rows,targetQuery,callback) {
      const collisionQuery = queries.select_matches_extend('users','('+targetQuery+')','username','username');
       db.all(collisionQuery, (err, collisionRows) => {
          callback(err,db,rows,collisionRows);
       });
    },
    // resolve renaming
    function(db,rows,collisionRows,callback) {
      _renameCollisions(db,rows,collisionRows,dryRun, (err,result) => {
        callback(err,db,result);
      });
    },
    // close the db
    function(db,result,callback) {
      _closeDB(db, (err) => {
        callback(err,result)
      });
    }
  ], function(err, result) {
    // finally, pass over the result
    finalCB(err,result);
  });
}

// method that takes in a data set and resolves collisions
// data is expected as a collection of {id:$, username:$} objects
// dryRun boolean determines whether updates are pushed to DB
function _renameCollisions(db, rows, collisionRows, dryRun, callback) {
  // create a set of all possible colliding usernames
  let collisionSet = new Set();
  (collisionRows).map((el) => {
    collisionSet.add(el.username)
  });
  // for each row to be renamed, append a random int
  // check for collisions, and if existing, append again
  // format data for placeholder syntax
  (rows).map((el) => {
    let newUser = el.username + Math.floor(Math.random()*10);
    while (collisionSet.has(newUser)) {
      newUser = el.username + Math.floor(Math.random()*10);
    }
    collisionSet.add(newUser);
    el.username = newUser;
  });
  if (!dryRun) {
    // db update
    callback(err,rows)
  }
  else {
    callback(null,rows);
  }
}

// methods to open and the database connection
function _instantiateDB(name, callback) {
	const db = new sqlite3.Database(name, (err) => {
    if (err) {
      callback(err,null);
    }
    else {
      console.log('Connected to the in-memory SQlite database: ' + db.filename);
      callback(null,db);
    }    
  });
}

// method to close the database connection
function _closeDB(db, callback) {
  db.close((err) => {
    if (err) {
      callback(err);
    }
    else {
      console.log('Closed the connection to the in-memory SQlite database: ' + db.filename);
      callback();
    }
  });
}

// table of all exported functions
const calls = {
  disallowed_usernames: disallowed_usernames,
  collision_resolution: collision_resolution,
  disallowed_collision_resolution: disallowed_collision_resolution
}

module.exports = calls;