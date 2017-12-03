var express = require('express');
var router  = express.Router();
var Campground = require('../models/campground');

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

router.post('/', isLoggedIn, function (req, res) {
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

router.get('/new', isLoggedIn, function (req, res) {
  res.render('camps/new');
});

//edit camp

router.get('/camp/:id/edit',
  checkCampOwnership,
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
router.put("/camp/:id", function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      console.log(err);
      res.redirect("/camps");
    }
    res.redirect("/camps/camp/" + req.params.id);
  })
})

//destroy campground
router.delete("/camp/:id", function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/camps");
    }
    res.redirect("/camps");
  })
})

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkCampOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        res.redirect('back');
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          return next();
        } else {
          res.redirect('back');
        }
      }
    })
  } else {
    res.redirect('back');
  }
}

module.exports = router;
