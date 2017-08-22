var MongoClient = require('mongodb').MongoClient;
//  var DB_CONN_STR = 'mongodb://localhost:27017/cwf1';
 var DB_CONN_STR = 'mongodb://babi:xs1h@139.196.240.36:22222/acc';

 //查询数据
var selectData = function(db, queryStr,skipNum, limitNum, callback){
    var collection = db.collection('acc');
    // var whereStr = queryStr;
    for(let key in queryStr){
        if(queryStr[key] == '' || queryStr[key] == null){
            delete queryStr[key];
        }
    }
    console.log(queryStr)    
    collection.find(queryStr, {limit: limitNum, skip: skipNum}).toArray(function(err, result) {
        if(err){
            console.log(err);
            return;
        }
        callback(result);
    })
}
//查询数量
var countData = function(db, queryStr, callback){
    var collection = db.collection('acc');
    collection.count(queryStr, function(err, result) {
        if(err){
            console.log(err);
            return;
        }
        callback(result);
    })
}


function selectd(req, res, next){
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        var queryStr = req.query;
        var skipNum = queryStr.skip ? parseInt(queryStr.skip) : 0;
        var limitNum = queryStr.limit ? parseInt(queryStr.limit) : 0;
        var startDate = queryStr.startDate ? parseInt(queryStr.startDate) : null;
        var endDate = queryStr.endDate ? parseInt(queryStr.endDate) : null;
        delete queryStr.skip;
        delete queryStr.limit;
        delete queryStr.startDate;
        delete queryStr.endDate;
        if(startDate!=null && endDate!=null){
            queryStr = Object.assign({},queryStr,{
                "time": {$gte: startDate, $lte: endDate},
            })
        }

        selectData(db, queryStr, skipNum, limitNum, function(result) {
            var dataResult = result;
            countData(db, queryStr, function(result){
                res.send(Object.assign({}, {count:result}, {data: dataResult}))
                db.close();
            })
        })
    })
}

function count(req, res, next) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");

        countData(db, req.query, function(result) {
            res.send({data: result})
            db.close();
        })
    })
}


module.exports =  {
    selectd : selectd,
    count : count,
}