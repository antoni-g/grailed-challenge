const sqlite3 = require('sqlite3').verbose();
const queries = require('./models/queries.js'); 

// open database in memory
let db = new sqlite3.Database('./db/grailed-exercise-copy.sqlite3', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database: ' + db.filename);
});

db.serialize(() => {

});
 
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the in-memory SQlite database connection: ' + db.filename);
});