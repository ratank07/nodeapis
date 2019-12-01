var express = require('express');
var router = express.Router()
var con = require('./connection.js')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var config = require('../config')



router.post('/',(req,res)=> {
    userobj = {
         "name" : req.body.name,
         "username":req.body.username,
         "email"  : req.body.email,
         "profile" : req.body.profile,
    
    }
        const saltRounds = 10;
        const myPlaintextPassword = req.body.passwd;
        const someOtherPlaintextPassword = 'not_bacon';
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
                // Store hash in your password DB.

              //  to check password is correct
              bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
                // res == true
                console.log("pass res"+res)
            });
                userobj.passwd = hash;
                con.connect(function(){
                    let sql = "insert into users SET ?"
                    con.query(sql,[userobj], function(err, result){
                        if(err) throw err;
                        res.send(result);
                    })
                })
            });
        });
        console.log("userobj"+userobj);
})


router.post('/login',(req,res)=> {
  
    var uname = req.body.username;
    PlaintextPassword = req.body.passwd;
    console.log("uname plantextpaswsswoerd"+uname,PlaintextPassword);
    con.connect(function(){
        let sql = "select * from users where username = ?"
        con.query(sql,[uname], function(err, result){

            console.log("result len"+result.length);

            if(err) throw err;
            if(result.length > 0) {
               
                var  hash = result[0].passwd;
              
               console.log('result hash passws'+hash);

               bcrypt.compare(PlaintextPassword, hash, function(err, result) {
                // res == true
                if(result){
                    var token = jwt.sign({ id: uname }, config.secret, {
                        expiresIn: '1d' // expires in 30 days
                      });
                      console.log('token created'+token)
                    //  var retval = {'message':'user is validated','token':token, 'auth':res}
                      res.send({'token':token, 'auth': true});
                }
                else{
                    res.send({'message':'user not validated'});
                }

                console.log("pass res"+res)
            });
            }
            else {
                res.send({'message':'user not found'});
            }
            

        })
    })

})


router.patch('/',(req,res)=> {

    let id = req.query.id;
    userobj = {
         "name" : req.body.name,
         "username":req.body.username,
         "email"  : req.body.email,
         "profile" : req.body.profile,
         "passwd" : req.body.passwd
    
    }
    console.log("userobj"+userobj);


    con.connect(function(){
        let sql = "update users SET ? where id= ?"
        con.query(sql,[userobj, id], function(err, result){
            if(err) throw err;
            res.send(result);
        })
    })
})
router.get('/',(req,res) => {
    con.connect(function(){
        let sql = "select * from users"
        con.query(sql, function(err, result){
            if(err) throw err;
            res.send(result);
        })
    })
})
router.get('/getone',(req, res)=>{
    let id =  req.query.id;
    con.connect(function(){
        let sql =  "select * from users where id = '"+id+"'"
        con.query(sql, (err, result)=> {
            if(err) throw err;
            res.send(result);
        })
    })
})

    router.delete('/',(req,res) => {
        let id = req.query.id;
        con.connect(function(){
            let sql = "delete from users where id = ?"
            con.query(sql,[id],function(err, result){
                if(err) throw err;
                res.send(result);
            })
        })
    })


 module.exports = router;