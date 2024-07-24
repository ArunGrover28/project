const express = require('express');
const app = express();
const fileuploader = require('express-fileupload');
const port = 2999;
const mysql = require('mysql2');

// var sql = mysql.createConnection({
//     host: "127.0.0.1",
//     user: "root",
//     password: "Raman@12345678",
//     database:"ott"
//   });
  var sql = mysql.createConnection({
    host: "b2fgn0anptkjdf6km76w-mysql.services.clever-cloud.com",
    user: "uf3lvy7rshsuo1pp",
    password: "TjjD1MO3Xqyimq0kUtWx",
    database:"b2fgn0anptkjdf6km76w",
    keepAliveInitialDelay:10000,
    enableKeepAlive:true
  });
  
  sql.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.use(fileuploader());
app.use(express.static('public'));
app.use(express.urlencoded(true));



app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function() {
    console.log('Server started successfully on port ' + port);
});


app.get("/rendermovies",function(req,res){
    let path = __dirname+"/public/movies.html";
    res.sendFile(path);
})

app.get("/watchmovie",function(req,res){
    let otherinfo = req.query.otherinfo;
    console.log(otherinfo);
    //  res.sendFile(__dirname+"/public/watchmovie.html");
})
app.get("/in",function(req,res){
    res.sendFile(__dirname+"/public/insert.html");
})

app.post("/insert",function(req,res){
    // let movieFile = req.files.moviename;
    // let otherinfo = req.body.otherinfo;

    let mname = req.body.mname;
    let mdiscription = req.body.mdiscription;
    let mpic = req.files.mpic;
    let mlink = req.body.mlink;
    mpic.mv(__dirname + '/public/upload/' + mpic.name, function(err) {
        if (err)
            return res.status(500).send(err);

        // console.log(movieFile);
        // console.log(otherinfo);
        console.log("moved succesfully")
    });
    sql.query("insert into film (mname,mpic,mdiscription,mlink)value(?,?,?,?)",[mname,mpic.name,mdiscription,mlink],function(err,result){
        if(err){
            console.log(err.message);
        }
        res.send("inserted succesfully");
    })

})

app.get("/fill-movie",function(req,res){
    sql.query("select * from film",[],function(err,result){
        if(err){
            res.send(err.message);
        }
        res.send(result)
    })
})

app.get("/fill-search",function(req,res){
    let mname = "%"+req.query.mname+"%";
    sql.query("select * from film where mname like ?",[mname],function(err,result){
        if(err){
            res.send(err);
        }
        res.send(result);
    })
})