const express = require("express");
const axios = require("axios");

const public_users = express.Router();

let books = require("./booksdb.js");

// ===============================
// Task 1 - Get all books
// ===============================
public_users.get("/", function (req, res) {
    return res.status(200).json(books);
});

// ===============================
// Task 2 - Get book by ISBN
// ===============================
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

// ===============================
// Task 3 - Get books by Author
// ===============================
public_users.get("/author/:author", function (req, res) {

    const author = req.params.author.toLowerCase();

    const filteredBooks = {};

    Object.keys(books).forEach(isbn => {

        if (
            books[isbn].author.toLowerCase() === author
        ) {
            filteredBooks[isbn] = books[isbn];
        }

    });

    return res.status(200).json(filteredBooks);

});

// ===============================
// Task 4 - Get books by Title
// ===============================
public_users.get("/title/:title", function (req, res) {

    const title = req.params.title.toLowerCase();

    const filteredBooks = {};

    Object.keys(books).forEach(isbn => {

        if (
            books[isbn].title.toLowerCase() === title
        ) {
            filteredBooks[isbn] = books[isbn];
        }

    });

    return res.status(200).json(filteredBooks);

});

// ===============================
// Task 5 - Get Book Reviews
// ===============================
public_users.get("/review/:isbn", function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});

// =======================================
// Task 10 - Async/Await using Axios
// =======================================

// Get All Books
async function getAllBooks() {
    try {

        const response = await axios.get(
            "http://localhost:5000/"
        );

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }
}

// Get Book by ISBN
async function getBookByISBN(isbn) {
    try {

        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }
}

// Get Books by Author
async function getBooksByAuthor(author) {
    try {

        const response = await axios.get(
            `http://localhost:5000/author/${encodeURIComponent(author)}`
        );

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }
}

// Get Books by Title
async function getBooksByTitle(title) {
    try {

        const response = await axios.get(
            `http://localhost:5000/title/${encodeURIComponent(title)}`
        );

        console.log(response.data);

    } catch (err) {

        console.log(err.message);

    }
}

// Export Router
module.exports.general = public_users;

// Export Async Functions
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
