const express = require('express');
const bodyParser = require('body-parser');
const { getDate } = require('./date');
require(__dirname + '/date.js');
const item = ['Eat Food', 'Go for Walk', 'Work'];
const workItems = [];

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render('index',{listTitle: getDate(), newlistitems: item});
});

app.post('/',function(req,res){
    var newitem = req.body.newItem;
    if (req.body.button === 'Work'){
        workItems.push(newitem);
        res.redirect('/work');
    }else{
        item.push(newitem);
        res.redirect('/');
    }
});

app.get('/work', function(req,res){
    res.render('index',{listTitle: 'Work List', newlistitems: workItems});
});

app.get('/about', function(req,res){
    res.render('about');
});

app.listen(3000, function(){
    console.log('Server Started At Port 3000');
});