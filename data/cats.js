var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cat_app', {
  useMongoClient: true
});

var catSchema = mongoose.Schema({
  name: String,
  age: Number,
  temperament: String,
});

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({
//   name: "Snowball",
//   age: 5,
//   temperament: "quite"
// });
//
// george.save(function (err, cat) {
//   if(err) {
//     console.log('Something went wrong');
//   }
//   console.log("just saved this cate to database");
//   console.log(cat);
// });
Cat.create({
  name: "Fluffy",
  age: 5,
  temperament: "nice"
}, function (err, cat) {
  if (err) {
    console.log("ERROR!");
    console.log(cat);
  } else {
    console.log("HERE'S a cat!");
    console.log(cat);
  }
});


Cat.find({}, function (err, cats) {
  if(err) {
    console.log("FUCKING ERROR IN FINDING FUCKING CAT!");
    console.log(err)
  } else {
    console.log("ALL THE CATS ARE BELOW!");
    console.log(cats);
  }
});
