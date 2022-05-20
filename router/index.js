const express = require('express');
const router = express.Router();
require("dotenv").config()
const axios = require('axios').default;

let url = process.env.api_url;



router.route("/").get(async(req, res) => {
    if (req.session.loggedin) {

        let username = req.session.username;
        let email = req.session.email;

        await axios.get(url+'/account/load/users',{
            "headers":{
                "Authorization":'Bearer '+req.session.token
            }
        })
        .then(function (data){

          //  console.log(data.data['data'])

            res.render("home", {
                username: username,
                email: email,
                data: req.session.data,
                users: data.data['data']
              })
        
        })
        .catch(function (error){
            let data =[];
            req.flash('error', error)
            res.render("home", {
                username: username,
                users: data
              })

        });

        


    }else{
        res.render("login");
    }
 
});

router.route("/login").get((req, res) => {

    if (!req.session.loggedin) {

        res.render("login");
    }
}).post( async (req, res) => {
    if (!req.session.loggedin) {

        let username = req.body.username;
        let password = req.body.password;

      

        await axios.post(url+'/account/login',{
            "username": username,
            "password": password
        }) .then(function (data) {

                if(data.data['message']=='Success'){

                    req.session.loggedin = true;
                    req.session.username = data.data['data'][0]['username'];
                    req.session.email = data.data['data'][0]['email'];
                    req.session.data = data.data['data'][0];
                    req.session.token = data.data['token'];

                    req.flash('success', 'Loggin Success')
                    res.redirect('/')

                }else{
                    console.log(data.data['message'])
                    req.flash('error', data.data['message'])
                    res.redirect('/login')
                }

        })
        .catch(function (err) {
            
            req.flash('error', err)
            res.redirect('/login')

    });
    }


})

router.route("/registration").get((req, res) => {


        res.render("registration");

}).post(async (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        let cpassword = req.body.cpassword;
        let email = req.body.email;
        let gender = req.body.gender;
        let phone = req.body.phone;


        console.log(username+password+cpassword+email+gender+phone)


        if(password == cpassword){

            await axios.post(url+'/account/create',{
                "id":"null",
                "phone":phone,
                "username":username,
                "password":password,
                "email":email,
                "idCountry":"1",
                "matricule":"matricule",
                "gender":gender,
                "codeFonction":"1",
                "idType":"1",
                "idLanguage":"1"
            },{
                "headers":{
                    "Authorization":'Bearer '+req.session.token
                }
            }) .then(function (data) {

               // console.log(data.data)
                console.log(data.data)
               console.log(data.data[0])
    
                    if(data.data['code']=='200'){
                    req.flash('success', data.data['message'])
                    res.redirect('/')
                        

                    }
                    if(data.data['code']=='400'){
                        req.flash('error', data.data['message'])
                        res.redirect('/')
                    }
    
            })
            .catch(function (err) {
                
                console.log(err)
                req.flash('error', err)
                res.redirect('/registration')
                
        });

        }else{

            req.flash('error', 'Passwords do not match')
            res.redirect('/registration')

        }

})




// Logout user

router.get('/logout', function (req, res) {

    req.flash('error', 'You have been LoggedOut');
    req.session.destroy();

    res.redirect('/');
  

});



module.exports = router;