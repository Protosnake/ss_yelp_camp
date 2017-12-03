var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment')

var data = [
  {
    name: "Cloud's rest",
    image: "https://farm7.staticflickr.com/6068/6042217185_89a79dbc00.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Foot's backyard",
    image: "https://farm2.staticflickr.com/1203/1132895352_afd086a60b.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Molester paradise",
    image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
]

function seedDb() {
  Campground.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Removed campgrounds");
  })
  //add camps
  data.forEach(function (seed) {
    Campground.create(seed, function (err, campground) {
      if (err) {
        console.log(err);
      }
      console.log("Created a campground");
      //create a comment
      Comment.create(
        {
          text: "This place is great but there's no internet access",
          author: "Homer"
        }, function (err, comment) {
          if(err) {
            console.log(err);
          }
          campground.comments.push(comment);
          campground.save();
          console.log("created a new comment");
        }
      );
    })
  })
}

module.exports = seedDb;
