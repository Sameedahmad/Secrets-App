
const express = require("express");
const ejs = require("ejs");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended:true
}))
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/UsersDB", { useNewUrlParser:true, useUnifiedTopology:true});


const userSchema = new mongoose.Schema ({
    email:String,
    password:String,
})






const User = new mongoose.model("User", userSchema);

app.get('/', function(req,res){
    res.render("home.ejs")
})

app.get('/register', function(req,res){
    res.render("register.ejs")
})

app.get('/login', function(req,res){
    res.render("login.ejs")
})

app.post('/register', function(req,res){
  
    const enteredPassword =req.body.password;

    bcrypt.hash(enteredPassword, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
            email: req.body.username,
            password:hash,
        })
    
        newUser.save(function(err){
            if(!err){
                res.render("secrets.ejs")
            } else {
                console.log(err);
            }
        })
    })
    });

    

app.post('/login', function(req,res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email:userEmail}, function(err, foundUser){
        if(foundUser){

            bcrypt.compare(userPassword, foundUser.password, function(err, result) {
                if(result == true) {
                    res.render("secrets.ejs")
                } else {
                    res.render("Kindly Register First then Login")
                }
            })

          

            } 
    })
})











app.listen(3000, function(){
    console.log("Server Started on Port 3000 Successfully")
})