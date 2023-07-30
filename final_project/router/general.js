const express = require('express');
let books = require("./booksdb.js"); //The Book Objects from this file 
let isValid = require("./auth_users.js").isValid; // uses the function to see if the user is valid
const users = require("./auth_users.js").users; // gets the list of users 
const public_users = express.Router(); // creates a Router for users 
const axios = require('axios');
// To Register a public user
public_users.post("/register", (req,res) => {
    
    //To get the username and password of the user 
    const username=req.body.username;
    const password=req.body.password;

  // Handle user logic 
  if(username && password)
  {
  if(!isValid(req.body.username))
  {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
  }
  else
  {
    return res.status(404).json({message: "User Already Exists"});
  }
}
  return res.status(404).json({message: "Unable to register user."});
  
});





// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
      } else {
        return res.status(404).json({ error: "Book not found" });
      }

 });

public_users.get('/ISBN/:isbn',async(req, res) => {
    try {
        // Fetch the list of books using the root path '/' with async-await
        
        const response = await axios.get('https://christopher7-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}');
    
        // If the response status is not 200 (OK), handle the error
        if (response.status !== 200) {
          return res.status(response.status).json({ error: "Failed to fetch books." });
        }
    
        const Book_By_ISBN = response.data;
    
        // Merge the books from the external API with the local books object
    
    
        return res.status(200).json(Book_By_ISBN);
      } catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching books." });
      }
    
    

    

  

 });



 //To get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
      return res.json(books);
  });

 public_users.get('/books', async (req, res) => {
    try {
      // Fetch the list of books using the root path '/' with async-await
      
      const response = await axios.get('https://christopher7-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
  
      // If the response status is not 200 (OK), handle the error
      if (response.status !== 200) {
        return res.status(response.status).json({ error: "Failed to fetch books." });
      }
  
      const booksFromApi = response.data;
  
      // Merge the books from the external API with the local books object
      const allBooks = { ...books, ...booksFromApi};
  
      return res.status(200).json(allBooks);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while fetching books." });
    }
  });
// Get book details based on author


public_users.get('/author/:author',function (req, res) {
  const Author= req.params.author;
  const BookByAuthor=[];
  for(const ISBN in books)
  {
      
      if(books[ISBN].author==Author)
      {
        BookByAuthor.push(books[ISBN]);
      }
  }

  if(BookByAuthor.length==0)
  {
      return res.status(404).json({message:"Author was not found"})
  }
  return res.status(200).json(BookByAuthor);
});

public_users.get('/Author/:author',async(req, res)=> {
    
    
    
    try {
        // Fetch the list of books using the root path '/' with async-await
        
        const response = await axios.get('https://christopher7-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}');
    
        // If the response status is not 200 (OK), handle the error
        if (response.status !== 200) {
          return res.status(response.status).json({ error: "Failed to fetch books." });
        }
    
        return res.status(200).json(response.data);


      } 
      catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching books." });
      }
});
    

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const Title= req.params.title;
    console.log(Title);
    for(const ISBN in books)
  {

      
      if(books[ISBN].title==Title)
      {
        return res.status(200).json(books[ISBN])
      }
  }

  
    return res.status(404).json({message:"Title was not found"})
  

});
public_users.get('/Title/:title',async(req, res)=> {
    
    
    
    try {
        // Fetch the list of books using the root path '/' with async-await
        
        const response = await axios.get('https://christopher7-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}');
    
        // If the response status is not 200 (OK), handle the error
        if (response.status !== 200) {
          return res.status(response.status).json({ error: "Failed to fetch books." });
        }
    
        return res.status(200).json(response.data);


      } 
      catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching books." });
      }
});
    

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
  const ISBN=req.params.isbn;
  if(books[ISBN])
  {
    return res.status(200).json(books[ISBN]);
  }
  
  return res.status(404).json({message: "That ISBN does not exist and no review could be given "});
});

module.exports.general = public_users;
