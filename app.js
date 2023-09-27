// configing dotenv
require('dotenv').config() ;
// installing express
const express = require('express') ;
const app = express()
// installing ejs
const ejs = require('ejs') ;
app.set('view engine' , 'ejs') ;
// installing body parser
const bodyParser = require('body-parser') ;
app.use(bodyParser.urlencoded({ extended : true })) ;
// setting static folder
app.use(express.static("public")) ;
// setting up encryption
const encrypt = require('mongoose-encryption') ;
// setting up mongoose
const mongoose = require('mongoose') ;
mongoose.connect("mongodb://127.0.0.1:27017/userDB") ;
const userSchema = new mongoose.Schema({
  email : String ,
  password : String
}) ;
// doing encryption
const secret = process.env.SECRET ;
userSchema.plugin(encrypt , {secret : secret , encryptedFields : ['password']}) ;


const User = mongoose.model("User" , userSchema) ;

// user GET Request
app.get("/" , function(req , res) {
  res.render("home") ;
}) ;
app.get("/login" , function(req , res) {
  res.render("login") ;
}) ;
app.get("/register" , function(req , res) {
  res.render("register") ;
}) ;


// user POST Request
app.post("/register" , function(req , res) {
  const newUser = new User({
    email : req.body.username ,
    password : req.body.password
  })
  newUser.save().then(() => {
    res.render("secrets") ;
    console.log("data succesfully saved")
  }).catch((err) => {
    console.log(err) ;
  }) ;
}) ;

app.post("/login" , function(req , res) {
  User.findOne({email : req.body.username}).then((foundUser) => {
    if (foundUser.password === req.body.password) {
      res.render("secrets") ;
    }
  }).catch((err) => {
    console.log(err) ;
  })
}) ;

// server listening on port
app.listen(3000 , function(err) {
  if (err) {
    console.log(err) ;
  } else {
    console.log("server listening on port 3000") ;
  }
})
