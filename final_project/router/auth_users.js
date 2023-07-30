const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// checks to see if the user is valid within the list 
const isValid = (username)=>{ 
    const userExists = users.some((user) => user.username === username);
    return userExists
}



// Finds a user within the users list 
const authenticatedUser = (username,password)=>{

let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
     });
    if(validusers.length > 0){
    return true;
    }
    else
    {
     return false
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;

  if(!username || !password)
  {
    return res.status(404).json({message: "Error logging in"});
  }
  
  if(authenticatedUser(username,password))
  {
        // basically gives the user an access token 
        let accessToken = jwt.sign({
        username: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization =
        {
            accessToken,username
        }



        return res.status(200).send("User successfully logged in" +"Access Token is " + accessToken);
        // Remeber to put this token into post man in order to make it delete 
        
  }


   else {
     return res.status(208).json({message: "Invalid Login. Check username and password"});
   }
    



});

// Adding  a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const ISBN=req.params.isbn;
 
  const newReview = {
    username: req.session.authorization['username'],
    reviewText: req.body,
  };


  
  
  console.log(req.session.authorization['username']);
  if(books[ISBN])
  {
      books[ISBN].reviews[newReview.username]=newReview.reviewText;
      return res.status(200).json({ message: 'Review added successfully.' });
} 
    else {
      return res.status(404).json({ message: 'Book not found.' });
    }
 
});






// Adding  a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {



  const ISBN=req.params.isbn;
  
  if(books[ISBN])
  {
      delete books[ISBN].reviews[req.session.authorization['username']];
      return res.status(200).json({ message: 'The book Review was deleted' });
      
    } 
    else {
      return res.status(404).json({ message: 'Book not found.' });
    }

}
 
);
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
