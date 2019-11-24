var express = require('express');
var router = express.Router()
var con = require('./connection.js')

router.post('/',(req,res)=> {
    userobj = {
         "name" : req.body.name,
         "username":req.body.username,
         "email"  : req.body.email,
         "profile" : req.body.profile,
         "passwd" : req.body.passwd
    
    }
    console.log("userobj"+userobj);

    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let profile = req.body.profile;
    let passwd = req.body.passwd;

    con.connect(function(){
        let sql = "insert into users SET ?"
        con.query(sql,[userobj], function(err, result){
            if(err) throw err;
            res.send(result);
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
        let sql = "update users SET ?"
        con.query(sql,[userobj], function(err, result){
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