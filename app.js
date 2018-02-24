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
    flash         = require('connect-flash'),
    methodOverride = require('method-override');

var commentRoutes = require('./routes/comments'),
    campsRoutes   = require('./routes/camps'),
    indexRoutes   = require('./routes/index');

seedDb();
//connecting to the DB
mongoose.connect("mongodb://localhost/yelp_camp", {
  useMongoClient: true
});

app.use(bodyParser.urlencoded({extended: "true"}));
//adding public folder
app.use(express.static(__dirname + "/public"));
//adding bootstrap
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
//adding jquery
app.use(express.static(__dirname + "/node_modules/jquery"));
//adding method override to get access for e.g. PUT and DELETE methods
app.use(methodOverride("_method"));
//setting view engine for ejs
app.set("view engine", "ejs");
//adding flash as feedback messages
app.use(flash());

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

app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});

app.listen(3000, function (error) {
  if(error) {
    console.log(error);
  }
  console.log('Server is running on port 3000!')
});
