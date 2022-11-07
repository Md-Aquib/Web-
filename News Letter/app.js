const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/failure',function(req,res){
    res.redirect('/');
});

app.post('/',function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/8788a4cb90";

    const options = {
        method: "POST",
        auth:"ex:875fb64678a2a5417cc3c67ed88e51c5-us18",

    }

    const request =  https.request(url , options , function(response){
        
        if(response.statusCode===200){
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }

        // response.on('data',function(data){
        //     console.log(JSON.parse(data))
        // });
    });

    request.write(jsonData);
    request.end();

});

app.listen(3000,function(){
    console.log("Server has started at port 3000");
});

