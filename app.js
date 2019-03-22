const sqlite3 = require('sqlite3').verbose();
 
// open database in memory
let db = new sqlite3.Database('./db/grailed-exercise-copy.sqlite3', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// dump all data in disallowed_usernames
db.serialize(() => {
	let query = 
  `SELECT id as id, invalid_username as invalid_username
  FROM disallowed_usernames`;
  console.log(query)
  db.each(query, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.id + "\t" + row.invalid_username);
  });
});
 
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});