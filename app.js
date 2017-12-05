var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    Campground = require('./models/campground'),
    seedDb     = require('./seeds'),
    Comment    = require('./models/comment'),
    passport   = require("passport"),
    User       = require("./models/user"),
    LocalStrategy = require("passport-local"),
    methodOverride = require('method-override');

var commentRoutes = require('./routes/comments'),
    campsRoutes   = require('./routes/camps'),
    indexRoutes   = require('./routes/index');

// seedDb();
mongoose.connect("mongodb://localhost/yelp_camp", {
  useMongoClient: true
});

app.use(bodyParser.urlencoded({extended: "true"}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(require("express-session")({
  secret: "Once upon a time",
  resave: false,
  saveUninitialize: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

app.use(indexRoutes);
app.use("/camps/camp/:id/comments", commentRoutes);
app.use("/camps", campsRoutes);

app.listen(3000, function (error) {
  if(error) {
    console.log(error);
  }
  console.log('Server is running on port 3000!')
});
