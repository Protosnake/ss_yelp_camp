var express = require('express');
var router  = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment    = require('../models/comment');

//comments new
router.get('/new', isLoggedIn, function (req, res ) {
  Campground.findById(req.params.id, function (err, camp) {
    if(err){
      console.log(err);
    }
    res.render("comments/new", {camp: camp})
  })
})

//comments create
router.post('/', isLoggedIn, function (req, res) {
  //find camp by id
  Campground.findById(req.params.id, function (err, camp) {
    if (err) {
      console.log(err);
      res.redirect("/camps");
    }
    //create a new comment
    Comment.create(req.body.comment, function (err, comment) {
      if (err) {
        console.log(err);
      }
      //add username and ID to comments
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      //connect new comment to campground
      comment.save();
      camp.comments.push(comment);
      camp.save();
      console.log(comment);
      res.redirect("/camps/camp/" + camp._id);
    });
  })
  //redirect to /camp/:id
})

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
