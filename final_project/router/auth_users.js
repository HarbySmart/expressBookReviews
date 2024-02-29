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
    //1) We fetch the ISBN given in the HTTP request parameters and filter the details (author, title, review) for that ISBN.
    //2)If the book with that ISBN exists, then the review added in the HTTP request query is fetched. Else, the message  "Unable to find this ISBN!" is rendered.
    //3)Session authorization is checked based on the username.
    //4)If a review has been provided in the HTTP request query, it is assigned to the given username,
    //and further to the reviews of the book with the above ISBN. This way multiple users can post and update their respective book reviews.
    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });
  
  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization['username'];
    let filtered_review = books[isbn]["reviews"];
    if (filtered_review[reviewer]){
        delete filtered_review[reviewer];
        res.send(`Reviews for the ISBN  ${isbn} posted by the user ${reviewer} deleted.`);
    }
    else{
        res.send("Can't delete, as this review has been posted by a different user");
    }
    });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
