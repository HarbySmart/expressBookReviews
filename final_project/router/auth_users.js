const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')
const regd_users = express.Router();

let users = [];

//check for the user validity
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if(userswithsamename.length > 0) {
        return true;
    }
    else {
        return false;
    }
}


//ckecking if the user is authenticated with the below function
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
});
if (validusers.length > 0) {
    return true;
}
else {
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if(authenticatedUser(username,password)) {

    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
} else {
    return res.status(208).json({message: "Invalid login. Check username and password"});
}
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if(books[isbn]){
    let book = books[isbn]
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
