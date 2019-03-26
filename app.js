const sqlite3 = require('sqlite3').verbose();
const queries = require('./models/queries.js'); 
const grailed_interface = require('./models/grailed_interface.js');

// // open database in memory
// let db = new sqlite3.Database('./db/grailed-exercise-copy.sqlite3', (err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Connected to the in-memory SQlite database: ' + db.filename);
// });

// db.serialize(() => {
//   // let query_0 = queries.select_duplicates('users','username');
//   // db.each(query_0, (err,row) => {
//   //   if (err) {
//   //     console.error(err.message);
//   //   }
//   //   else if (row) {
//   //     console.log(row.id + "\t" + row.username);
//   //   }

//   // });


//   // let sub_query = '('+queries.select_duplicates('users','username')+')'
//   // let query_3 = queries.select_matches_extend('users',sub_query,'username','username');
//   // // REGEXP ('^' || disallowed_usernames.invalid_username || '[0-9]+')
//   // db.each(query_3, (err,row) => {
//   //     if (err) {
//   //       console.error(err.message);
//   //     }
//   //     else if (row) {
//   //       console.log(row.id + "\t" + row.username);
//   //     }
//   //   });
//   // });
 
// // close the database connection
// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Closed the in-memory SQlite database connection: ' + db.filename);
// });

// grailed_interface.disallowed_usernames('./db/grailed-exercise-copy.sqlite3', (err,rows) => {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(rows);
//   }
// });


grailed_interface.select_duplicates('./db/grailed-exercise-live.sqlite3', (err,result) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(result.length);
    console.log(result);
  }
});

