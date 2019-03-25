/*
	Write a function that finds all users with disallowed usernames. 
	Disallowed usernames can be found in the `disallowed_usernames` table.
*/

/*
	Write a function that resolves all username collisions. 
	E.g., two users with the username `foo` should become `foo` and `foo1`. 
	The function accepts an optional "dry run" argument that will print the affected rows to the console, not commit the changes to the db.
*/

/*
	Write a function that resolves all disallowed usernames. 
	E.g., `grailed` becomes `grailed1`. 
	The function accepts an optional "dry run" argument that will print the affected rows to the console, not commit the changes to the db.
*/


// internal methods to open and close the database connection
function instantiateDB(name) {
	let db = new sqlite3.Database('name', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database: ' + db.filename);
  return db;
});
}

function closeDB(db) {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the connection to the in-memory SQlite database: ' + db.filename);
  });
}

// table of all exported functions
const calls = {

}

module.exports = calls;