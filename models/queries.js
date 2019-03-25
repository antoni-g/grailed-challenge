// returns a SQL query to select duplicated rows based on a target column in a target table
var select_duplicates = function(table,column) {
  return `SELECT *
  FROM `+table+`
  WHERE `+column+` IN (
    SELECT `+column+` 
    FROM `+table+`
    GROUP BY `+column+`
    HAVING count(*) > 1
  )`
}

// returns a SQL query to select rows (id, target value) where 
// where values in columnA match exactly to values in columnB
// Ordered ascending
var select_matches = function(tableA, tableB, columnA, columnB) {
  return `SELECT `+tableA+`.id, `+tableA+`.`+columnA+`
  FROM `+tableA+`
  JOIN `+tableB+`
  ON `+tableA+`.`+columnA+` = `+tableB+`.`+columnB+`
  ORDER BY `+tableA+`.`+columnA+` ASC`
}

// prepares and returns a SQL query to update a specific column in a table with placeholder parameters
// takes in a list of id/value pairs (ready to be passed to a prepared statement) and a list of ids
// these arguments are ordered arrays since they are necessary to fill placeholders in sqlite3 for node.js
var update_vals = function(table, column, values, ids) {
  let ret_query =
  `UPDATE `+table+`
      SET `+column+` = (case
  `;
  for (let i = 0; i < values.length/2; i++) {
     ret_query += `when id = (?) then (?) \n`
  }
  ret_query += 
  `end)
  WHERE id IN (`+ids.map((val) => `(?)`).join(`,`)+`)`
  return ret_query
}

// returns a sql query that finds matches table A and table B
// where values in columnA appended with a wildcard match columnB
var select_matches_extend = function(tableA, tableB, columnA, columnB) {
  return `SELECT id, 
  FROM `+tableA+`
  INNER JOIN (
    SELECT `+columnB+`
    FROM `+tableB+`
  ) match
  ON `+tableA+`.`+columnA+` LIKE match.`+columnB+` || '_%'`
}

// table of all exported functions
const queries = {
  select_duplicates: select_duplicates,
  select_matches: select_matches,
  select_matches_extend: select_matches_extend,
  update_vals: update_vals
}

module.exports = queries;