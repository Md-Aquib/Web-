const express = require('express');
const bodyParser = require('body-parser');
const { getDate } = require('./date');
require(__dirname + '/date.js');
const mongoose = require('mongoose');
var _ = require('lodash');
// const workItems = [];

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {useNewUrlParser: true});

const itemSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemSchema]
};

const Item = mongoose.model('Item',itemSchema);

const List = mongoose.model('List',listSchema);

const item1 = new Item ({
    name: 'Welcome to ToDo List'
});

const item2 = new Item ({
    name: 'Enter a new ToDo list Item'
});

const item3 = new Item ({
    name: '<-- Hit this to delete item.'
});

var defaultItems = [item1,item2,item3];

app.get('/', function(req,res){
    Item.find({},function(err,foundItem){
        if(foundItem.length === 0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("Successfully inserted")
                }
            });
            res.redirect('/')
        }
        else{
            res.render('index',{listTitle: 'Today', newlistitems: foundItem}); 
        }
    });
});

app.post('/',function(req,res){
    var newitem = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name : newitem
    })
    if(listName === 'Today'){
        item.save()
        res.redirect('/')
    }else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }
});

app.post('/delete',function(req,res){
    const itemId = req.body.checkbox;
    const listName = req.body.ListName;
    if(listName === 'Today'){
        Item.findByIdAndRemove(itemId,function(err){
            if(err){
                console.log(err)
            }else{
                console.log('Deleted !!!')
                res.redirect('/')
            }
        });
    }else{
        List.findOneAndUpdate({name: listName} , {$pull: {items: {_id: itemId}}}, function(err,foundList){
            if(!err){
                res.redirect('/' + listName);
            }
        });
    }
});


// app.get('/work', function(req,res){
//     res.render('index',{listTitle: 'Work List', newlistitems: workItems});
// });


app.get('/about', function(req,res){
    res.render('about');
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
  
    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
  
          res.render("index", {listTitle: foundList.name, newlistitems: foundList.items});
        }
      }
    });
});    
  

app.listen(3000, function(){
    console.log('Server Started At Port 3000');
});
