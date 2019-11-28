var express = require('express')
var mysql = require('mysql')
var bodyparser = require('body-parser')
var cors = require('cors')
var userRoute = require('./routes/user.js')
var con = require('./routes/connection.js')
var app = express()
app.use(bodyparser.json())
app.use(cors())
app.use(bodyparser.urlencoded({extended: true}))

app.use('/userroute',userRoute);
con.connect(function(err){
if(err) throw err;
console.log("connected");
var sql = "create database IF NOT EXISTS mysqldb";
con.query(sql, function(err, result){
    if(err){
        throw err;
    } 
    console.log("db mysqldb created result"+result);
})

var sqltb = "CREATE TABLE if not exists users (id int primary key auto_increment,name VARCHAR(255), username VARCHAR(255), email varchar(255), profile varchar(255), passwd varchar(255))";
    con.query(sqltb, function(err, result){
        if(err) throw err;
        console.log("users table created"+JSON.stringify(result))
    })
})

app.post('/', (req,res) => {
var cname = req.body.name;
var caddress = req.body.address;
console.log(`name is ${cname} and  addr is ${caddress}`)
con.connect(function(){
    let sql = "insert into customers (name, address) values ('"+cname+"','"+caddress+"')";
    con.query(sql, function(err, result){
        if(err) throw err;
        console.log("inserted suseeslly"+result);
       res.send(result);
    })
})
})

app.get('/', (req,res) => {

    con.connect(function(){
        let sql = "select * from customers";
        con.query(sql, function(err, result){
            if(err) throw err;
           res.send(result);
        })
    })
    })

    app.delete('/', (req,res) => {
        var id = req.query.id;
        console.log("id param is"+id)
        con.connect(function(){
            let sql = "delete from customers where id = ?";
            con.query(sql, [id], function(err, result){
                if(err) throw err;
               res.send(result);
            })
        })
        })

        app.patch('/', (req,res) => {
            let id = req.query.id;
            let name = req.body.name;
            let address = req.body.address;
            console.log("id param is"+id +" name is"+name)
            con.connect(function(){
                let sql = "update customers set name = '"+name+"', address = '"+address+"' where id = ?";
                con.query(sql, [id], function(err, result){
                    if(err) throw err;
                   res.send(result);
                })
            })
            })
             
            app.get('/selectone', (req,res)=>{

                let id = req.query.id;
                con.connect(function() {
                    sql = "select * from customers where id = '"+id+"'";
                    con.query(sql,function(err, result){
                        if(err) throw err;
                        res.send(result);
                    })
             
                })
                
            })


try{
    app.listen(3000, (err)=> {
        if(err) {
            console.log("error in connecting"+err)
        }
        console.log("server connected to port 3000")
    })
}
catch(error) {
    console.log("error in serever"+error);
};

