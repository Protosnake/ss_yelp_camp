var express = require('express');
var router  = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware/index');

router.get('/', function (req, res) {
  //get all campgrounds from DB
  console.log(req.user);
  Campground.find({}, function (err, allCamps) {
    if(err) {
      console.log(err);
    } else {
      res.render('camps/camps', {camps: allCamps, currentUser: req.user});
    }
  });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  Campground.create(
    {name: name, image: image, description: description, author: author},
    function (err, newlyCreated) {
      if(err){
        console.log(err);
      } else {
        console.log(newlyCreated);
        res.redirect('/camps');
      }
    }
  );
});

router.get('/camp/:id', function (req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log("error" + err);
    }
    res.render("camps/camp", {camp: foundCampground});
  })
})

router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('camps/new');
});

//edit camp

router.get('/camp/:id/edit',
  middleware.checkCampOwnership,
  function(req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      res.redirect('back');
    } else {
      res.render('camps/edit', {camp: foundCampground});
    }
  })
})

//update camp
router.put("/camp/:id", middleware.checkCampOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      console.log(err);
      res.redirect("/camps");
    }
    res.redirect("/camps/camp/" + req.params.id);
  })
})

//destroy campground
router.delete("/camp/:id", middleware.checkCampOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/camps");
    }
    res.redirect("/camps");
  })
})

module.exports = router;
