const async = require("async");
const sqlite3 = require('sqlite3').verbose();
const queries = require('./queries.js'); 

/*
	Write a function that finds all users with disallowed usernames. 
	Disallowed usernames can be found in the `disallowed_usernames` table.
*/
var disallowed_usernames = function(name, finalCB) {
  async.waterfall([
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
  _conflictResolution(name, dryRun, 'username duplicates', finalCB);
}

/*
	Write a function that resolves all disallowed usernames. 
	E.g., `grailed` becomes `grailed1`. 
	The function accepts an optional "dry run" argument that will print the affected rows to the console, not commit the changes to the db.
*/
var disallowed_resolution = function(name, dryRun, finalCB) {
  _conflictResolution(name, dryRun, 'invalid usernames', finalCB);
}

// since both questions 2 and 3 are the same operation on different data sets
// have them wrap the same method with a case argument to resolve which dataset to operate on
function _conflictResolution(name, dryRun, dataSet, finalCB) {
  async.waterfall([
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
        case 'username duplicates': 
          targetQuery = queries.select_duplicates('users','username');
          break;
        case 'invalid usernames':
          targetQuery = queries.select_matches('users','disallowed_usernames','username','invalid_username');
          break;
        default:
          callback('An invalid dataSet argument has been passed for collision resolution.');
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
    // this loop guarantees we have unique username resolutions
    // assuming that our usernames are limited to some character length significantly lower than
    // max str length in our db, it is guaranteed to work
    while (collisionSet.has(newUser)) {
      newUser = el.username + Math.floor(Math.random()*10);
    }
    collisionSet.add(newUser);
    el.username = newUser;
  });
  if (!dryRun) {
    // db update
    _updateRows(db, rows, 'users', 'username', (err,msg) => {
      if (err) {
        callback(err);
      }
      else {
        console.log(msg);
        callback(null,rows);
      }
    });
  }
  else {
    callback(null,rows);
  }
}

// function that updates rows users with data in a given table
// data is expected as a collection of {id:$, column:$} objects
function _updateRows(db, data, table, column, callback) {
  if (!data || data.length == 0) {
    callback(null,'Nothing needed updating.')
  }
  else {
    let vals = []
    let ids = []
    data.map((val) => {
      vals.push(val.id);
      vals.push(val.username);
      ids.push(val.id);
    });
    // since we are limited to 999 variables per SQLite statement but have all unique values,
    // we need to break out data into multiple update queries while minimizing the total number of UPDATE statements.
    let starts = [];
    let curr = 0;
    while (curr < ids.length) {
      starts.push(curr);
      curr+= 333;
    }
    // map over all starts and fire off one update per 333 (or less) items
    async.map(starts, (start, internalCB) => {
      let tVals = vals.slice(start, start+666);
      let tIds = ids.slice(start, start+333);
      let query = queries.update_vals(table, column, tVals, tIds);
      db.run(query, tVals.concat(tIds), (err) => {
          if (err) {
              internalCB(err,'Error updatings items from: '+start+' to '+(start+333));
          }
          else {
              internalCB(null,'done items from: '+start+' to '+(start+333));
          }
      });
      // final cb called when update is done
    }, (err,res) => {
        // when done, call the top level callback
        callback(err,'Done updating.');
    });
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
  disallowed_resolution: disallowed_resolution
}

module.exports = calls;