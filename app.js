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
  db.run(query_0, [400000+Math.floor(Math.random()*10000), 'test_400000', date.toISOString(), date.toISOString()], function(err) {
    if (err) {
      return console.log(err.message);
    }
    console.log('inserted one item');
  });

  // test adding items
  let test = [];
  let placeholders = []
  let max = Math.floor(Math.random()*10);
  for (let i = 0; i < 1; i++) {
    let val = Math.floor(Math.random()*10000);    
    test.push(val)
    test.push('test_'+val);
    test.push(date.toISOString());
    test.push(date.toISOString());
    placeholders.push('(?, ?, ?, ?)');
  }
  placeholders = placeholders.join(',');
  let query_1 = 
  `INSERT INTO disallowed_usernames(id,invalid_username,created_at,updated_at) 
  VALUES` + placeholders
  console.log(query_1);
  //let vars = test.map((item) => {item.id, item.invalid_username, date.toISOString(), date.toISOString()});
  console.log(test);
  db.run(query_1, test, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`inserted multiple items to disallowed_usernames ${this.changes}`);
  });

  // test adding items to users
  let test2 = [];
  max = 3+Math.floor(Math.random()*8);
  let placeholders2 = []
  for (let i = 0; i < max; i++) {
    let val = 10000+Math.floor(Math.random()*10000);    
    test2.push(val)
    test2.push('test_'+val);
    placeholders2.push('(?, ?)')
  }
  placeholders2.join(',');
  let query_3 = 
  `INSERT INTO users(id,username) 
  VALUES` + placeholders2
  console.log(query_3);
  console.log(test2);
  db.run(query_3, test2, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`inserted multiple items to users ${this.changes}`);
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

  // find all duplicate usernames in users
  let query_4 = 
  `SELECT id, username 
  FROM users
  WHERE username IN (
    SELECT username 
    FROM users
    GROUP BY username
    HAVING count(*) > 1
  )
  `
  db.each(query_4, (err,row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.id + "\t" + row.username);
  });

  // find all usernames that are disallowed
  let query_5 =
  `SELECT users.id, users.username
  FROM users
  JOIN disallowed_usernames
  ON users.username = disallowed_usernames.invalid_username
  ORDER BY users.username ASC
  `
  db.each(query_5, (err,row) => {
    if (err) {
      console.error(err.message);
    }
    if (row)
      console.log(row.id + "\t" + row.username);
  });
  let test3 = [96, 'new_test5', 97, 'new_test6', 98, 'new_test7', 99, 'new_test8'];
  let test4 = [96,97,98,99]
  let query_6 =
  `UPDATE disallowed_usernames
      SET invalid_username = (case
  `;
  for (let i = 0; i < test3.length/2; i++) {
    query_6 += `when id = (?) then (?) \n`
  }
  query_6 += 
  `end)
  WHERE id IN (`+test4.map((val) => '(?)').join(',')+')'
  test3 = test3.concat(test4);
  console.log(query_6);
  db.run(query_6, test3, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`updated multiple items to disallowed_usernames ${this.changes}`);
  });
});
 
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed the database connection.');
});