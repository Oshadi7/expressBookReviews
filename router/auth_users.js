const express = require("express");
const jwt = require("jsonwebtoken");

const authenticated = express.Router();

let books = require("./booksdb.js");

let users = [];

// =====================================
// Helper Functions
// =====================================

const isValid = (username) => {
  return username && username.trim() !== "";
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// =====================================
// Task 6 - Register New User
// =====================================

authenticated.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and Password required",
    });
  }

  if (!isValid(username)) {
    return res.status(400).json({
      message: "Invalid Username",
    });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  users.push({
    username,
    password,
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login",
  });
});

// =====================================
// Task 7 - Login
// =====================================

authenticated.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and Password required",
    });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign(
      {
        username,
      },
      "access",
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  }

  return res.status(403).json({
    message: "Invalid Login. Check username and password",
  });
});

// =====================================
// Task 8 - Add / Modify Review
// =====================================

authenticated.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully",
    reviews: books[isbn].reviews,
  });
});

// =====================================
// Task 9 - Delete Review
// =====================================

authenticated.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  }

  return res.status(404).json({
    message: "No review found for this user",
  });
});

module.exports.authenticated = authenticated;
