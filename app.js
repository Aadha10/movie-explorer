const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongodbSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./models/User");
const axios = require("axios");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://wopocin930:a6ekOptbHOXi2JJe@cluster0.sd7u3ug.mongodb.net/sessions",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Mongodb is connected...");
  })
  .catch((error) => {
    console.log("Failed to connect", error);
  });
const store = new mongodbSession({
  uri: "mongodb+srv://wopocin930:a6ekOptbHOXi2JJe@cluster0.sd7u3ug.mongodb.net/sessions",
  collection: "sessions",
});

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const API_KEY = "40c49d56";

app.get("/", (req, res) => {
  res.redirect("/landing");
});

app.get("/landing", (req, res) => {
  res.render("landing");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.redirect("/login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.redirect("/login");
  }
  req.session.isAuth = true;
  req.session.user = user;
  req.session.username = user.username;
  res.redirect("/layout");
});


app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.redirect("/register");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = new userModel({
      username,
      email,
      password: hashPassword,
    });

    await user.save();
    console.log("User saved:", user);
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.redirect("/register");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.get("/layout", (req, res) => {
  res.render("layout", { movies: [], username: req.session.username });
});

app.post("/search", async (req, res) => {
  const searchTerm = req.body.searchTerm;
  const url = `http://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}&plot=short`;

  try {
    const response = await axios.get(url);
    const movies = response.data.Search || [];
    const moviesWithPlot = await Promise.all(
      movies.map(async (movie) => {
        const movieUrl = `http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}&plot=full`;
        const movieResponse = await axios.get(movieUrl);
        return movieResponse.data;
      })
    );
    res.render("layout", { movies: moviesWithPlot, username: req.session.username  });
  } catch (error) {
    console.error(error);
    res.render("layout", { movies: [], username: req.session.username  });
  }
});

const isAuth = (req, res, next) => {
  if (req.session.isAuth && req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
