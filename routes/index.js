var express = require('express');
var router  = express.Router();
var passport = require('passport');
var User = require('../models/user');
var fs = require('fs');


router.get('/', function (req, res) {
  // console.log(path.join(__dirname, 'public/images'));
  // fs.readdir(path.join(__dirname, 'public/images'), function (err, files) {
  //   console.log(files);
  //   res.render("landing", {images: files});
  // })
  images = fs.readdir(__dirname + "/../public/images", function (err, images) {
    console.log(images);
    res.render("landing", {images: images});
  });

});

router.get("/register", function (req, res) {
  res.render("register");
})

router.post("/register", function (req, res) {
  var newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function (err, user) {
    if(err) {
      console.log(err);
      return res.render("/register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/camps");
    })
  })
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("local",
  {
  successRedirect: "/camps",
  failureRedirect: "/login"
  }),
  function (req, res) {
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/camps");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
