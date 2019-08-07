const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User Model
 const  User = require("../models/User");

//Login Route
router.get("/login", (req, res) => res.render("login"));

//Register Route
router.get("/register", (req, res) => res.render("register"));

//handle Registration
 router.post("/register", (req, res) => {
    const { name, email, password, password2}  = req.body; 
     let errors = [];
   
  //check for required fields
   if( !name|| !email|| !password|| !password2){
     errors.push({msg: "Please fill in all the fields"});
   }
 // check if Passwords Match
  if( password != password2 ){
      errors.push({ msg:"Passwords do not match"});
  }
 //check password length
  if(password.length < 6){
     errors.push({msg : " Password must be at least 6 characters long"}); 
  }
  if(errors.length > 0){
      res.render("register", {
          errors,
          name,
          email,
          password,
          password2
      });
  } else{
      //If Validation Was Passed
      User.findOne({email: email})
          .then(user =>{
            if(user){
              //user already Registered
             errors.push({msg: "This Email already exist"});
             res.render("register", {
                errors,
                name,
                email,
                password,
                password2
            });     
          } else {
            newUser = new User({
                name,
                email,
                password
            });
            //Hash Password
             bcrypt.genSalt(10, (err, salt) =>
             bcrypt.hash(newUser.password, salt, (err,hash) =>{
              if(err) throw err;
              //set password to hashed one
               newUser.password = hash;
              //Save user
               newUser.save()
                      .then(user => {
                       req.flash("success_msg", "Registration successful, you can now log in!")   
                   res.redirect("/users/login")
                 })
                .catch(err => console.log(err)) 
            }));
        }
      })
  } 
 });
 
 // Handle Login
  router.post("/login", (req, res,next) =>{
   passport.authenticate("local" , {
      successRedirect : "/dashboard",
      failureRedirect : "/users/login",
      failureFlash : true 
   })(req, res, next);
  });

// Handle Logout 
  router.get("/logout", (req,res) =>{
     req.logout();
     req.flash("success_msg" , "You have successfully Logged Out");
     res.redirect("/users/login");
  });

module.exports = router;
