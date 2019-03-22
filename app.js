const sqlite3 = require('sqlite3').verbose();
 
// open database in memory
let db = new sqlite3.Database('./db/grailed-exercise-copy.sqlite3', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});


// add random items and then test dump all data in disallowed_usernames
db.serialize(() => {
  // test adding one item
  let query_0 = 
  `INSERT INTO disallowed_usernames(id,invalid_username,created_at,updated_at) 
  VALUES (?, ?, ?, ?)`
  let date = new Date();
  db.run(query_0, [400+Math.floor(Math.random()*10000), 'test_0', date.toISOString(), date.toISOString()], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log('inserted one item');
  })

  // test adding items
  let test = [];
  let max = Math.floor(Math.random()*10);
  for (let i = 0; i < max; i++) {
    let val = Math.floor(Math.random()*10000);
    test.push({'id': val, 'invalid_username': 'test_'+val, 'created_at':date.toISOString(), 'updated_at':date.toISOString()});
  }
  let placeholders = test.map((item) => '(?, ?, ?, ?)').join(',');
  let query_1 = 
  `INSERT INTO disallowed_usernames(id,invalid_username,created_at,updated_at) 
  VALUES` + placeholders;
  console.log(query_1);
  let vars = test.map((item) => [item.id,item.invalid_username,item.created_at,item.updated_at]);
  console.log(vars);
  db.run(query_1, vars, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`inserted multiple items ${this.changes}`);
  });

  // dump all data in disallowed_usernames
	let query_2 = 
  `SELECT id as id, invalid_username as invalid_username
  FROM disallowed_usernames`;
  console.log(query_2);
  db.each(query_2, (err, row) => {
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