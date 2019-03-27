const grailed_interface = require('./models/grailed_interface.js');
const copy_file = require('./utils/file_overwrite.js');
const readline = require('readline');
const log = require('debug')('cli');

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let question = `
What would you like to do? Enter the corresponding number:

1 -> SELECT all disallowed usernames that exist in the users table
2 -> Rename all username collisions in the users table
3 -> Rename all disallowed usernames in the users table
4 -> Reset the database to its original state
5 -> Exit

`
// initial prompt
log('prompting initial question');
input.question(question,processAnswer);

// process the answer
function processAnswer(answer) {
  log('prompted initial question, handling response: '+answer);
  console.log();
  // handle each question appropriately
  switch(answer.trim()) {
    case '1':
      console.log('Outputting all users with disallowed usernames...')
      outputDisallowed();
      input.close();
      break;
    case '2':
      dryPrompt('username');
      break;
    case '3':
      dryPrompt('disallowed');
      break;
    case '4':
      console.log('Resetting database...');
      resetDB();
      input.close();
      break;
    case '5':
      console.log('Exiting...');
      input.close();
      process.exit();
      break;
    default:
      console.log(`Sorry, ${answer} is not a valid input.`);
      input.close();
      process.exit();
  }
};

function dryPrompt(tgt) {
  input.question('Is this a dry run? (no changes will be committed to the database). Input y/n: \n', (answer) => {
    log('dry run prompted, handling answer : '+answer);
    switch(answer.trim()) {
      case 'y':
        if (tgt === 'username') { resolveDuplicates(true); }
        if (tgt === 'disallowed') { resolveDisallowed(true); }
        input.close();
        break;
      case 'n':
      console.log('Committing changed to database.');
        if (tgt === 'username') { resolveDuplicates(false); }
        if (tgt === 'disallowed') { resolveDisallowed(false); }
        input.close();
        break;
      default:
        console.log(`Sorry, ${answer} is not a valid input.`);
        input.close();
    }
  });
}

function outputDisallowed() {
  grailed_interface.disallowed_usernames('./db/grailed-exercise-live.sqlite3', (err,res) => {
      if (err) {
        console.log('An error occured processing this question.');
        log('Error outputting for outputDisallowed: '+err);
      }
      else {
        outputRows(res);
      }
  });
}

function resolveDuplicates(dry) {
  grailed_interface.collision_resolution('./db/grailed-exercise-live.sqlite3', dry, (err,res) => {
      if (err) {
        console.log('An error occured processing this question.');
        log('Error outputting for resolveDuplicates: '+err);
      }
      else {
        outputRows(res);
      }
  });
}

function resolveDisallowed(dry) {
  grailed_interface.disallowed_resolution('./db/grailed-exercise-live.sqlite3', dry, (err,res) => {
      if (err) {
        console.log('An error occured processing this question.');
        log('Error outputting for resolveDisallowed: '+err);
      }
      else {
        outputRows(res);
      }
  });
}

function resetDB() {
  copy_file.copy_file('./db/grailed-exercise.sqlite3','./db/grailed-exercise-live.sqlite3', (err,res) => {
    if (err) {
      console.log('There was an error reseting the database.');
      log('Error resetting db: '+err);
    }
    else {
      console.log('Successfully reset the database.');
      log('closed the db, closing with no errors.');
    }
    process.exit();
  });
}

function outputRows(input) {
  console.log();
  console.log('Outputting '+input.length+' rows from users.');
  console.log();
  console.log('  id \t| username');
  console.log('  -------------------');
  if (input.length == 0) {
    console.log('The query returns no results.')
  }
  input.map((el) => {
    console.log('  '+el.id +' \t| ' + el.username);
  });
  // reaching the end of this method means the function has finished;
  log('output achieved, closing with no errors.')
  process.exit()
}