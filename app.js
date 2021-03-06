const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport")

const app = express();

//Passport Config
 require("./config/passport")(passport);

//DB Config
  const db = require("./config/keys").mongoURI;

//Connect DB
 mongoose.connect(db, {useNewUrlParser: true})
         .then(() => console.log("MongoDB Connected!"))
         .catch( err => console.log(err));

//Including BodyParser
   app.use(express.urlencoded({ extended : false }));

// express session
   app.use(session({
     secret : "secret",
     resave : true,
     saveUninitialized: true
   }));

//Passport Middleware
app.use(passport.initialize());   
app.use(passport.session());
// Connect Flash
   app.use(flash());

// custom message middleware
  app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
  });   
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
