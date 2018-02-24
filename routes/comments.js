var express = require('express');
var router  = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment    = require('../models/comment');
var middleware = require('../middleware/index');

//comments new
router.get('/new', middleware.isLoggedIn, function (req, res ) {
  Campground.findById(req.params.id, function (err, camp) {
    if(err){
      console.log(err);
    }
    res.render("comments/new", {camp: camp})
  })
})

//comments create
router.post('/', middleware.isLoggedIn, function (req, res) {
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

//edit comment
router.get(
  '/:comment_id/edit',
  middleware.checkCommentOwnership,
  function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.render('comments/edit', {camp_id: req.params.id, comment: foundComment});
    }
  })
})

//update comment
router.put(
  '/:comment_id',
  middleware.checkCommentOwnership,
  function (req, res) {
  Comment.findByIdAndUpdate (req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      console.log(err);
      res.redirect('back');
    }
    res.redirect('/camps/camp/' + req.params.id);
  })
})

module.exports = router;
