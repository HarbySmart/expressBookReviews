const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;
  
  //check if username and password exist
  if(username && password){
    if(!isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. You can now login"});
    }
    else {
        return res.status(404).json({message: "User already exist!"});
    }
  }
    return res.status(404).json({message: "Cannot register user without username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    console.log(author)
    const answer = {}
    const ISBN = Object.keys(books)
    for (let i=0; i<ISBN.length; i++){
        const isbn = ISBN[i]
        
        if ( books[isbn].author === author){
            answer[isbn] = books[isbn]
        }
    }
    console.log(answer)
    if(Object.keys(answer).length > 0){
        return res.send(JSON.stringify(answer, null, 4))
    }
    return res.status(404).json({message: "Author not found"});
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    console.log(title)
    const ISBN = Object.keys(books)
    const answer = {}
    for(let i=0; i<ISBN.length; i++) {
        const isbn = ISBN[i]
      if(books[isbn].title === title) {
        answer[isbn] = books[isbn]
      }
    }
      console.log(answer)
      if(Object.keys(answer).length > 0){
          return res.send(JSON.stringify(answer, null, 4))
      }
      return res.status(404).json({message: "Title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews)
});

module.exports.general = public_users;
