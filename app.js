//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
const uri = "mongodb://localhost:27017/userDB";
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(uri,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//Changed Schema to mongoose Schema object so we can use encrypt
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});




const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});


app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
});

});
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          // result == true
          if(result){
            res.render("secrets");
          }else{
            console.log("User password doesnt match");
            res.send("User password doesnt match");
          }
        });
      }else{
        res.send("NO User with name: "+ username);
      }
    }
  });
});
















app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
