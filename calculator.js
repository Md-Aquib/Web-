const express = require("express");
const bodyParser  = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/',function(req,res){
    var num1 = parseInt(req.body.num1);
    var num2 = parseInt(req.body.num2);
    var opr = req.body.opr;
    var result;

    switch (opr) {
        case '+':
            result = num1+num2
            break;

        case '-':
            result = num1-num2
            break;

        case '*':
            result = num1*num2
            break; 

        case '/':
            result = num1/num2
            break;       
    
        default:
            result = num1+num2
            break;
    }

    res.send("The result of the calculation is: " + result);

});

app.listen(3000,function(){
    console.log('Server Started At Port: 3000');
});