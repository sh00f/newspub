/* 
Author: 
    Felix.X.Zhang 
Date: 
    2014-6-21 
Introduction: 
    this module provides you with the operations  of add,del,update,select. 
*/  
  
//pre-required params  
var sql = require('msnodesql');
var dboperatedata = require('./dboperatedata.json');
var json = require('./operatejson.js');
var paramObj = json.getParamObj();
var conn_str = "Driver={" + paramObj.mydb_driver + "};Server={" + paramObj.mydb_server + "};Database={" + paramObj.mydb_database + "};uid=" + paramObj.mydb_user + ";PWD=" + paramObj.mydb_pwd + ";";


//open database  
sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log(err);
    }
});
function exeScript(sqlscript) {
    sql.queryRaw(conn_str, sqlscript, function (err, results) {
        
        if (err) {
            console.log(err);
        }  
        else {
            console.log(results);
        }
    });
}
function select(sqlscript,fn) {
    sql.queryRaw(conn_str, sqlscript, function (err, results) {
        
        if (err) {
            console.log(err);
            return;
        }  
        else {
            var txt = toJson(results, paramObj.table_name);
            var jsonObj = eval("(" + txt + ")");
            //console.log(jsonObj);            
            //return jsonObj;
        }
        fn(jsonObj);
    });
}
function del(sqlscript) {
    
    exeScript(sqlscript);
}
function update(sqlscript) {
    exeScript(sqlscript);
}
function add(sqlscript) {
    exeScript(sqlscript);
}


function selectbydata(dboparatename,val, fn) {
    var sqlscript= getsqlstr(dboparatename, "select", val);
    sql.queryRaw(conn_str, sqlscript, function (err, results) {
        
        if (err) {
            console.log(err);
            return;
        }  
        else {
            var txt = toJson(results, paramObj.table_name);
            var jsonObj = eval("(" + txt + ")");
            //console.log(jsonObj);            
            //return jsonObj;
            fn(jsonObj);
        }
        
    });
}


function delbydata(dboparatename,val) {
    var sqlscript=getsqlstr(dboparatename, "delete", val);
    exeScript(sqlscript);
}
function updatebydata(dboparatename, val) {
    var sqlscript =getsqlstr(dboparatename, "update", val);
    exeScript(sqlscript);
}
function addbydata(dboparatename, val) {
    var sqlscript =getsqlstr(dboparatename, "insert", val);
    exeScript(sqlscript);
}


//convert table to json  
function toJson(dt, tbName) {
    var jsonString;
    if (dt != undefined && dt.rows.length > 0) {
        var rowLen = dt.rows.length;
        var colLen = dt.meta.length;
        jsonString = "{";
        jsonString += "\"" + tbName + "\":[";
        for (var i = 0; i < rowLen; i++) {
            jsonString += "{";
            for (var j = 0; j < colLen; j++) {
                if (j < colLen - 1) {
                    jsonString += "\"" + dt.meta[j].name + "\":" + "\"" + dt.rows[i][j] + "\",";
                }  
                else if (j == colLen - 1) {
                    jsonString += "\"" + dt.meta[j].name + "\":" + "\"" + dt.rows[i][j] + "\"";
                }
            }
            if (i == rowLen - 1) {
                jsonString += "}";
            }  
            else {
                jsonString += "},";
            }
        }
        jsonString += "]}";
        return jsonString;
    }
    else {
        jsonString = "{";
        jsonString += "\"" + tbName + "\":[]}";
        return jsonString;
    }
}
//拼装insert，update，delete ，select,sqlstr语句
//dboparatename,dboperatedata.json文件中的对应数据表
//operatetype：操作类型insert，update，delete ，select
//val对应字段的值，复制dboperatedata[dboparatename]补充fieldvalue，keyvalue或cond
function getsqlstr(dboparatename,operatetype,val) {
    var data = dboperatedata[dboparatename];
    
    var sqlstr = "";
    if (operatetype == "insert") {
        
        for (var j = 0; j < data.fieldvalue.length; j++) {
            
            var fd = "";//字段
            var fdv = "";//字段对应的值
            for (var i = 0; i < data.insertfnparam.length; i++) {
                if (val.fieldvalue[j][data.updatefnparam[i]] == undefined) {
                    //没有赋值不插入
                }
                else {
                    fd += fd == ""?data.field[data.insertfnparam[i]][0]:"," + data.field[data.insertfnparam[i]][0];
                    if (data.field[data.insertfnparam[i]][1] == "int" || data.field[data.insertfnparam[i]][1] == "float")
                        fdv += fdv == ""?val.fieldvalue[j][data.insertfnparam[i]]:"," + val.fieldvalue[j][data.insertfnparam[i]];
                    else
                        fdv += fdv == ""?"'" + val.fieldvalue[j][data.insertfnparam[i]] + "'":",'" + val.fieldvalue[j][data.insertfnparam[i]] + "'";
                }
            }
            
            var sqlstrtmp = " insert into ";
            sqlstrtmp += " " + data.dbtable + " (";           
            sqlstrtmp += fd;
            sqlstrtmp += ") values (";
            sqlstrtmp += fdv;
            sqlstrtmp += " ) ";
            
            sqlstr += sqlstrtmp;
        }
        //console.log(sqlstr);
    }

    if (operatetype == "update") {
        for (var j = 0; j < data.fieldvalue.length; j++) {
            
            
            var fdv = "";//字段对应的值
            for (var i = 0; i < data.updatefnparam.length; i++) {
                if (val.fieldvalue[j][data.updatefnparam[i]] == undefined) {
                    //没有赋值不更新

                }
                else {
                    if (data.field[data.updatefnparam[i]][1] == "int" || data.field[data.updatefnparam[i]][1] == "float")
                        fdv += fdv == ""?data.field[data.updatefnparam[i]][0] + "=" + val.fieldvalue[j][data.updatefnparam[i]]:"," + data.field[data.updatefnparam[i]][0] + "=" + val.fieldvalue[j][data.updatefnparam[i]];
                    else
                        fdv += fdv == ""?data.field[data.updatefnparam[i]][0] + "='" + val.fieldvalue[j][data.updatefnparam[i]] + "'":"," + data.field[data.updatefnparam[i]][0] + "='" + val.fieldvalue[j][data.updatefnparam[i]] + "'";
                }
            }
            var condstr = "";
            
            var flag = true;//关键字段没有全部赋值，不更新  
            for (var k = 0; k < data.keyfield.length; k++) {
                if (val.fieldvalue[j][data.keyfield[k]] == undefined) {
                //没有赋值不更新
                    flag = false;
                }
                else {
                    if (data.field[data.keyfield[k]][1] == "int" || data.field[data.keyfield[k]][1] == "float")
                        condstr += condstr == ""?data.field[data.keyfield[k]][0] + "=" + val.fieldvalue[j][data.keyfield[k]]:" and " + data.field[data.keyfield[k]][0] + "=" + val.fieldvalue[j][data.keyfield[k]];
                    else
                        condstr += condstr == ""?data.field[data.keyfield[k]][0] + "='" + val.fieldvalue[j][data.keyfield[k]] + "'":" and " + data.field[data.keyfield[k]][0] + "='" + val.fieldvalue[j][data.keyfield[k]] + "'";
                }
            }
            //关键字段没有全部赋值，不更新
            if (flag==true) {           
                var sqlstrtmp = " update ";
                sqlstrtmp += data.dbtable + " set ";
                sqlstrtmp += fdv;
                sqlstrtmp += " where ";
                sqlstrtmp += condstr;
                sqlstr += sqlstrtmp;
            }
        }
        
        console.log(sqlstr);
    }

    if (operatetype == "delete") {
        
        for (var j = 0; j < data.fieldvalue.length; j++) {
            var condstr = "";
            var flag = true;//关键字段没有全部赋值，不更新
              
            for (var k = 0; k < data.keyfield.length; k++) {
                if (val.fieldvalue[j][data.keyfield[k]] == undefined) {
                    flag = false;
                } 
                else {
                    
                    if (data.field[data.keyfield[k]][1] == "int" || data.field[data.keyfield[k]][1] == "float")
                        condstr += condstr == ""?data.field[data.keyfield[k]][0] + "=" + val.fieldvalue[j][data.keyfield[k]]:" and " + data.field[data.keyfield[k]][0] + "=" + val.fieldvalue[j][data.keyfield[k]];
                    else
                        condstr += condstr == ""?data.field[data.keyfield[k]][0] + "='" + val.fieldvalue[j][data.keyfield[k]] + "'":" and " + data.field[data.keyfield[k]][0] + "='" + val.fieldvalue[j][data.keyfield[k]] + "'";
                }
            }
            if (flag == true) {
                var sqlstrtmp = " delete from ";
                sqlstrtmp += " " + data.dbtable + " ";
                //sqlstrtmp += fdv;
                sqlstrtmp += " where ";
                sqlstrtmp += condstr;
                sqlstr += sqlstrtmp;
            }
        }
        console.log(sqlstr);
    }
        
        if (operatetype == "select") {
            
            var fd = "";//字段
            //console.log(data.field.fd3[0]);
            for (var i = 0; i < data[val.selectfd].length; i++) {
                fd += fd == ""?data.field[data[val.selectfd][i]][0]:"," + data.field[data[val.selectfd][i]][0];
            }
        //获取cond
        var cond = "";
        if (data.cond == "" || data.cond == undefined) {

        } else {
            cond = data.condstr[data.cond];//获取where字符串
            //console.log(cond);

            for (var item in val.condparam[data.cond]) {
                //cond.replace(/+"@"+data.field[item][0]+/g, val.condparam[data.cond][item]);
                cond=cond.replace(new RegExp("@"+data.field[item][0], 'g'),  val.condparam[data.cond][item]);
                //console.log("@" + data.field[item][0]+";"+ val.condparam[data.cond][item]);
            }
        }
        //console.log(cond);

            var sqlstrtmp = " select ";
            sqlstrtmp += fd;
            sqlstrtmp += " from " + data.dbtable + " ";
        //sqlstrtmp += val.cond==""|| val.cond==undefined?"": " where " + val.cond;
        sqlstrtmp += cond == "" || cond == undefined?"": " where " + cond;
            sqlstr += sqlstrtmp;
            //console.log(sqlstr);
        }
        
        //存储过程
        if (operatetype == "Q") {

        }

   
   

    return sqlstr;
}



exports.add = add;
exports.del = del;
exports.update = update;
exports.select = select;

exports.addbydata = addbydata;
exports.delbydata = delbydata;
exports.updatebydata = updatebydata;
exports.selectbydata = selectbydata;  