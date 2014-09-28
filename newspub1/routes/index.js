
/*
 * GET home page.
 */
var crypto = require('crypto');
var sql = require('../sqldata/dbhelper.js');
var sqldata = require('../sqldata/dboperatedata.json');

module.exports = function (app) {

    app.get('/', function (req, res) {
        var rt = [];
        var sqldatadb2 = sqldata.db2;
        console.log(sqldatadb2.field.fd2[0]);
        
        //sql.addbydata("db2", sqldatadb2);
        //sql.updatebydata("db2", sqldatadb2);
        //sql.delbydata("db2", sqldatadb2);
        sql.selectbydata("db2", sqldatadb2, function (rlt) {
            for (var i = 0; i < rlt.tbname.length; i++) {
                rt[i] = rlt.tbname[i][sqldatadb2.field.fd3[0]];
            }
            res.render('index', { title: 'Express', items: rt });
            //{ status: 'json' }
            //res.jsonp(rlt);
        });
        
    });

    //app.get('/', routes.index);
    //app.get('/users', user.list);
    
    app.get('/jsonp', function (req, res) {
        //返回jsonp
        res.jsonp({ status: 'jsonp' });
    });
    
    app.post('/dbinfo', function (req, res) {
        //返回json
        var tb = req.body.tb;
        //console.log(tb);
        var sqldatadb2 = sqldata[tb];   
        
       
        res.jsonp(sqldatadb2);
      
       
    });

    app.post('/getdata', function (req, res) {
        //返回jsonp
        var tb = req.body.tb;
        var bakdata = req.body.data;
        //var sqldatadb2 = sqldata["db2"];
        //console.log(bakdata.field.fd3[0]);
        sql.selectbydata(tb, bakdata, function (rlt) {

            res.jsonp(rlt.tbname);
        });
    });

}




 //var index=function (req, res){
   // try {
  //      var jsondata = require("./sqldata/conn.json");
  //      console.log(jsondata.driver);
  //  }
  //  catch (err)
  //  {// throw err; 
  //  }
  //res.render('index', {title: 'Express',list:[] });

/*var conn_str = "Driver={SQL Server Native Client 11.0};Server={172.16.4.248};Database={dczx};uid=web;PWD=80777467;";
sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return "Error opening the connection!";
    }
    var sqlstr = "SELECT [id], [clsname], [clsid], [teaname], [teaid], [type], [schyear], [grade], [subname], [subid]     FROM [B_clsAndTea]    where schyear = '2008' and grade = '0' and type = 'bzr'";
    conn.queryRaw(sqlstr, function (err, results) {
        if (err) {
            console.log("Error running query!");
            return "Error running query!";
        }
        var rt = [];
        for (var i = 0; i < results.rows.length; i++) {
           // console.log("0:" + results.rows[i][0]);
            rt[i]= results.rows[i][0];
        }
        res.render('index', { title: 'Express', items: rt });
        //return rt;
    });
    });
*//*
 var sqlstr = "SELECT [id], [clsname], [clsid], [teaname], [teaid], [type], [schyear], [grade], [subname], [subid]     FROM [B_clsAndTea]    where schyear = '2008' and grade = '0' and type = 'bzr'";
    //sqlstr += "SELECT [id], [clsname], [clsid], [teaname], [teaid], [type], [schyear], [grade], [subname], [subid]     FROM [B_clsAndTea]    where schyear = '2008' and grade = '0' and type = 'bzr'";
    
    var rt = [];
    
    sql.select(sqlstr, function (rlt) {

        for (var i = 0; i < rlt.tbname.length; i++) {
            rt[i] = rlt.tbname[i].id;
        }
        
        //console.log(rlt.tbname.length);
        //res.render('index', { title: 'Express', items: rt });
    });
    //console.log(rts.tbname[0].id);
    
    // sql.select(sqlstr);
//res.render('index', { title: 'Express', items: rt });

    var sqldatadb2 = sqldata.db2;
    console.log(sqldatadb2.field.fd2[0]);
    
    //sql.addbydata("db2", sqldatadb2);
    //sql.updatebydata("db2", sqldatadb2);
    //sql.delbydata("db2", sqldatadb2);
sql.selectbydata("db2", sqldatadb2, function (rlt) {
    for (var i = 0; i < rlt.tbname.length; i++) {
        rt[i] = rlt.tbname[i][sqldatadb2.field.fd3[0]];
    }
    res.render('index', { title: 'Express', items: rt });
});
}

exports.index = index;
*/