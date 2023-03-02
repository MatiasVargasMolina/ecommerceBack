const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
var cookieParser = require('cookie-parser');
const session = require('express-session');
const dbConfig = require("./app/config/db.config");
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();

var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};
const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/ecommerce',
  collection: 'sessions'
});
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(session({
  secret: 'secret token',
  resave: false,
  saveUninitialized: true,
  unset: 'destroy',
  store: store,
  name: 'session cookie name',
  genid: (req) => {
      // Returns a random string to be used as a session ID
  }
}));

const db = require("./app/models");
const Role = db.role;
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/productos.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
