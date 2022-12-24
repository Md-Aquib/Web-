const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
require('dotenv').config();
// const md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const session = require('express-session')
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { initialize } = require('passport');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: 'This is my little secret.',
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.set('strictQuery', false);

//////////////////////////////////////////////////////////////////////////

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//////////////////////// URLS ////////////////////////////////////////////

app.get('/',function(req,res){
    res.render('home')
});


app.route('/login')
.get(function(req,res){
    res.render('login')
})

.post(function(req,res){

    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/secrets');
            })
        }
    })

    // const useremail = req.body.username;
    // const userpassword = req.body.password;

    // User.findOne({email: useremail}, function(err,founduser){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(founduser){
    //             bcrypt.compare(userpassword, founduser.password, function(err, result) {
    //                 if(result == true){
    //                     res.render('secrets');
    //                 }
    //             });
    //         }
    //     }
    // })
})

app.get('/secrets',function(req,res){
    if(req.isAuthenticated()){
        res.render('secrets');
    }else{
        res.redirect('/login');
    }
});

app.route('/submit')
.get(function(req,res){
    res.render('submit');
})

.post(function(req,res){
    const userSecret = req.body.secret;
    
    User.findById(req.user.id, function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                foundUser.secret = userSecret;
                foundUser.save(function(){
                    res.redirect('/secrets');
                })
            }
        }

    })

})

app.get('/logout',function(req,res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

app.route('/register')
.get(function(req,res){
    res.render('register')
})

.post(function(req,res){

    User.register({username:req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else{
            passport.authenticate('local')(req,res,function(){
                res.redirect('/secrets');
            })
        }
    });

    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     const newUser = new User({
    //         email: req.body.username,
    //         password: hash
    //     })
    //     newUser.save(function(err){
    //         if(err){
    //             console.log(err)
    //         }
    //         else{
    //             res.render('secrets');
    //         }
    //     }) 
    // });
})

///////////////////////////////////////////////////////////////////

app.listen(3000,function(){
    console.log('Server started at port 3000');
});

app.use(function (req, res) {
    res.status(404).send('<h1>error 404</h1>');
})