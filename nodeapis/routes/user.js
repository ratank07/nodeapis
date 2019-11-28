var express = require('express');
var router = express.Router()
var con = require('./connection.js')
var bcrypt = require('bcrypt')
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