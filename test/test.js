const assert = require('chai').assert;
const expect = require('chai').expect;
const sqlite3 = require('sqlite3').verbose();
const queries = require('./../models/queries.js'); 
const grailed_interface = require('./../models/grailed_interface.js');
const copy_file = require('./../utils/file_overwrite.js')

describe('question 1 - #disallowed_usernames()', function() {
  context('', function() {
    it('create a fresh copy of the database', function(done) {
      copy_file.copy_file('./db/grailed-exercise.sqlite3','./db/grailed-exercise-test.sqlite3', (err,res) => {
        if (err) return done(err);
        expect(res)
          .to.be.a('string')
          .and.equal('./db/grailed-exercise.sqlite3 successfully copied into ./db/grailed-exercise-test.sqlite3');
        done();
      });
    });
    it('SELECT usernames in users that are in disallowed_usernames',function(done) {
      grailed_interface.disallowed_usernames('./db/grailed-exercise-test1.sqlite3', (err,res) => {
        if (err) return done(err);
        // hardcoded copy of the what the result should be from the original database
        let comp = [  { id: 1957, username: 'about' },
                      { id: 3487, username: 'about' },
                      { id: 5580, username: 'about' },
                      { id: 9441, username: 'about' },
                      { id: 2400, username: 'grailed' },
                      { id: 2873, username: 'grailed' },
                      { id: 4737, username: 'grailed' },
                      { id: 6491, username: 'grailed' },
                      { id: 2448, username: 'heroine' },
                      { id: 3035, username: 'heroine' },
                      { id: 8141, username: 'heroine' },
                      { id: 6935, username: 'privacy' },
                      { id: 9491, username: 'privacy' },
                      { id: 9921, username: 'privacy' },
                      { id: 4302, username: 'profile' },
                      { id: 9478, username: 'profile' },
                      { id: 9537, username: 'profile' },
                      { id: 786, username: 'settings' },
                      { id: 3206, username: 'settings' },
                      { id: 7011, username: 'settings' },
                      { id: 7088, username: 'settings' },
                      { id: 7599, username: 'settings' },
                      { id: 9807, username: 'settings' },
                      { id: 4512, username: 'terms' },
                      { id: 9479, username: 'terms' } ];
        expect(res)
          .to.be.a('array')
          .to.have.lengthOf.above(0);
        expect(res[0])
          .to.have.a.property('id') 
        expect(res[0])
          .to.have.a.property('username');
        expect(res[0].id)
          .to.be.a('number');
        expect(res[0].username)
          .to.be.a('string');
        expect(res)
          .to.have.lengthOf(25)
          .and.eql(comp);
        done();
      });
    })
	});
});

describe('question 1 - #disallowed_usernames()', function() {
  context('', function() {
    it('create a fresh copy of the database', function(done) {
      copy_file.copy_file('./db/grailed-exercise.sqlite3','./db/grailed-exercise-test.sqlite3', (err,res) => {
        if (err) return done(err);
        expect(res)
          .to.be.a('string')
          .and.equal('./db/grailed-exercise.sqlite3 successfully copied into ./db/grailed-exercise-test.sqlite3');
        done();
      });
    });
  });
});