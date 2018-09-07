/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
let bookId;

suite('Functional Tests', () => {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', (done) => {
     chai.request(server)
      .get('/api/books')
      .end((err, res) => {
        /*assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');*/
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', ()  => {


    suite('POST /api/books with title => create book object/expect book object', ()  => {
      
      test('Test POST /api/books with title', (done)  => {
        chai.request(server)
          .post("/api/books")
          .send({title: "Test 1"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "res.body is an object");
            assert.equal(res.body.title, "Test 1");
            assert.isArray(res.body.comments, "res.body.comments must be an array");
            assert.isEmpty(res.body.comments, "res.body.comments must be an empty array");
            bookId = res.body.id;
            done();
        });
      });
      
      test('Test POST /api/books with no title given', (done)  => {
        chai.request(server)
          .post("/api/books")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no title given");
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books',  (done) => {
       chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db',  (done) => {
        chai.request(server)
        .get('/api/books/testId')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.include(["couldn't get book", "no book exists"], res.text);
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  (done) => {
       chai.request(server)
        .get('/api/books/' + bookId)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "res.body is an object");
          assert.equal(res.body.title, "Test 1");
          assert.isArray(res.body.comments, "res.body.comments must be an array");
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', (done) => {
       chai.request(server)
        .post('/api/books/' + bookId)
        .send({comment: "Test Comment"})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "res.body is an object");
          assert.isArray(res.body.comments, "res.body.comments must be an array");
          assert.include(res.body.comments, "Test Comment");
          done();
        });
      });
      
    });
    
    
    suite('Delete /api/books => delete all books', () => {
      
      test('Test DELETE /api/books/[id]', (done) => {
       chai.request(server)
        .delete('/api/books/' + bookId)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "delete successful");
          done();
        });
      });
      
    });

  });

});
