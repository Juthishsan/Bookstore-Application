const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  }).then((booksList) => {
    res.send(JSON.stringify(booksList, null, 4));
  }).catch((err) => {
    res.status(500).json({message: "Error retrieving books"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if(books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  }).then((book) => {
    res.send(book);
  }).catch((err) => {
    res.status(404).json({message: err});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
      let filteredBooks = Object.values(books).filter(b => b.author === author);
      if(filteredBooks.length > 0) resolve(filteredBooks);
      else reject("Author not found");
  })
  .then(result => res.send(result))
  .catch(err => res.status(404).json({message: err}));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
      let filteredBooks = Object.values(books).filter(b => b.title === title);
      if(filteredBooks.length > 0) resolve(filteredBooks);
      else reject("Title not found");
  })
  .then(result => res.send(result))
  .catch(err => res.status(404).json({message: err}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
      res.send(book.reviews);
  } else {
      res.status(404).json({message: "Book not found"});
  }
});

// Code implementation to retrieve details using async/await with Axios
async function getAllBooksAxios() {
    try {
        let response = await axios.get("http://localhost:5000/");
        return response.data;
    } catch(err) {
        return null;
    }
}

async function getBookByIsbnAxios(isbn) {
    try {
        let response = await axios.get("http://localhost:5000/isbn/" + isbn);
        return response.data;
    } catch(err) {
        return null;
    }
}

async function getBookByAuthorAxios(author) {
    try {
        let response = await axios.get("http://localhost:5000/author/" + author);
        return response.data;
    } catch(err) {
        return null;
    }
}

async function getBookByTitleAxios(title) {
    try {
        let response = await axios.get("http://localhost:5000/title/" + title);
        return response.data;
    } catch(err) {
        return null;
    }
}

module.exports.general = public_users;
