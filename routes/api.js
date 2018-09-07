/*
*
*
*       Complete the API routing below
*       
*       
*/

"use strict";

const expect = require("chai").expect;
/*
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

const BookSchema = new Schema({
  title: {type: String, require: true},
  commentcount: {type: Number, default: 0},
  comments: [String]
});

let Book = mongoose.model("Book", BookSchema);

module.exports = (app) => {

  app.route("/api/books")
    .get((req, res, next) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
        if(err) return res.send("couldn't get books");
        else 
          return res.send(books.map(b => ({
            _id: b._id,
            title: b.title,
            commentcount: b.commentcount
          })));
      });
    })
    
    .post((req, res, next) => {
      let title = req.body.title;
      if(!title) return res.send("no title given");
      //response will contain new book object including atleast _id and title
      new Book({title}).save((err, book) => {
        if (err) return res.send("couldn't post book");
        else return res.json({
          title: book.title,
          comments: book.comments,
          id: book._id
        });
      });
    })
    
    .delete((req, res, next) => {
      //if successful response will be "complete delete successful"
      Book.deleteMany({}, err => {
        if(err) return res.send("couldn't delete books");
        else return res.send("complete delete successful");
      });
    });



  app.route("/api/books/:id")
    .get((req, res, next) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, book) => {
        if(err) return res.send("couldn't get book");
        else if(book) return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
        else return res.send("no book exists");
      });
    })
    
    .post((req, res, next) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment) return res.json();
      //json res format same as .get
      Book.findById(bookid, (err, book) => {
        if(err) return res.send("couldn't post comment");
        else if(book) {
          book.comments.push(comment);
          book.commentcount+=1;
          book.save((err, book) => {
            if(err) return next(err);
            else return res.json({
              _id: book._id,
              title: book.title,
              comments: book.comments
            });
          });
        }
        else return res.send("no book exists");
      });
    })
    
    .delete((req, res, next) => {
      let bookid = req.params.id;
      //if successful response will be "delete successful"
      Book.findByIdAndDelete(bookid, (err, doc) => {
        if(err) return res.send("couldn't delete book");
        else if(doc) return res.send("delete successful");
        else return res.send("no book exists");
      });
    });
  
};
