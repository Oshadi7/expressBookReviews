const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const customers_routes = require("./router/auth_users.js").authenticated;
const general_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

// Session configuration
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// JWT authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({
          message: "User not authenticated",
        });
      }
    });
  } else {
    return res.status(403).json({
      message: "User not logged in",
    });
  }
});

// Register routes
app.use("/", general_routes);
app.use("/customer", customers_routes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the Book Review API");
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
