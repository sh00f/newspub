/*
Author:
	Felix.X.Zhang
Date:
	2014-6-19
Introduction:
	this module provides you with the operations (read) of xml file.
*/

//Async Method
/*

     var libxmljs=require('libxmljs');
     var fs=require('fs');
	 var path='./config.xml';
	 var param=new params();
	 fs.readFile(path, 'utf8', function(err, data) { 
	  if (err) throw err;
	  var xmlDoc = libxmljs.parseXmlString(data);
	  // xpath queries
	 
	  var mydb = xmlDoc.get('//mydb');
	  var table=xmlDoc.get('//mydb//table');
	  param.mydb_server=mydb.attr('server').value();
	  param.mydb_database=mydb.attr('database').value();
	  param.mydb_user=mydb.attr('user').value();
      param.mydb_pwd=mydb.attr('pwd').value();
      param.table_name=table.attr('name').value();

	}); 
*/

var jsondata = require("./conn.json");

function params() {
    this.mydb_driver = "";
    this.mydb_server = "";
    this.mydb_database = "";
    this.mydb_user = "";
    this.mydb_pwd = "";
    this.table_name = "";
}
function getParamObj() {
    /*var libxmljs = require('libxmljs');
    var fs = require('fs');
    var path = './config1.xml';
    var param = new params();
    var data;
    try {
        data = fs.readFileSync(path, 'utf8');
    }
	 catch (err) {
        throw err;
    }
    var xmlDoc = libxmljs.parseXmlString(data);
    var mydb = xmlDoc.get('//mydb');
    var table = xmlDoc.get('//mydb//table');
    param.mydb_driver = mydb.attr('driver').value();
    param.mydb_server = mydb.attr('server').value();
    param.mydb_database = mydb.attr('database').value();
    param.mydb_user = mydb.attr('user').value();
    param.mydb_pwd = mydb.attr('pwd').value();
    param.table_name = table.attr('name').value();
    //console.log(param.mydb_server+" "+param.table_name);
    */
    var jsondata = require("./conn.json");
    var param = new params();
    param.mydb_driver = jsondata.driver;// mydb.attr('driver').value();
    param.mydb_server = jsondata.server;// mydb.attr('server').value();
    param.mydb_database = jsondata.database;// mydb.attr('database').value();
    param.mydb_user = jsondata.user;// mydb.attr('user').value();
    param.mydb_pwd = jsondata.pwd;// mydb.attr('pwd').value();
    param.table_name = jsondata.tbname;// table.attr('name').value();
    

    return param;
}

exports.getParamObj = getParamObj;