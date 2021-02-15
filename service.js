const { exec } = require('child_process');
var CONFIG = require('./config.json');
var ObjectId = require('mongodb').ObjectId;

//common print for result
async function Print(obj){

    console.log("-------------------------------------------------------------------------------------------------------");
    console.log(obj);
    console.log("-------------------------------------------------------------------------------------------------------");
}

//list of database from mongo db
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    return databasesList;
}

//connect particular db
async function getDb(client){
    dbo = client.db(CONFIG.domesticDB);
    return dbo;
}


//get all collection from database
async function getColectionData(dbo){

    return new Promise(function(resolve, reject) {

    dbo = dbo.collection(CONFIG.transport_collection).find().toArray(function(err, result){
        if(err) throw err;
        Print(result);
        resolve(result);
    });

});
}

//get document by id
async function getById(dbo, id){

    
    return new Promise(function(resolve, reject) {

    dbo.collection(CONFIG.transport_collection).findOne({_id: ObjectId(id)}, function(err,data){
        Print(data);
        resolve(data);
    });

    });
}

//insert new document
async function insert(dbo ,obj){

    return new Promise(function(resolve, reject) {
    //insert data
    dbo.collection(CONFIG.transport_collection).insertOne(obj, function(err, res){
        if(err) throw err;
        console.log("Document uploaded successfully :)");
        Print(res.ops[0]);
        resolve(res.ops[0]);
    });

});

}

//delete document
async function DeleteRecod(dbo, id){

    return new Promise(function(resolve, reject) {

    //delete data
    dbo.collection(CONFIG.transport_collection).deleteOne({_id: ObjectId(id)}, function(err, result) {

        if(err) throw err;
        console.log("Deleted successfully :)");
        resolve("ok");
        
    });

    });
}


//edit document
async function Update(dbo, obj, id){

    return new Promise(function(resolve, reject) {

    //update data
    dbo.collection(CONFIG.transport_collection).updateOne({_id: ObjectId(id)}, {$set: obj}, function(err, result) {

        if(err) throw err;
        console.log("Updated successfully :)");
        //after update get updated data
        dbo.collection(CONFIG.transport_collection).findOne({_id: ObjectId(id)}, function(err,data){
            Print(data);
            resolve(data);
        });
    });
});
}

//export modules
module.exports = {
    getallDatabases: listDatabases,
    getDb : getDb,
    getData : getColectionData,
    print : Print,
    get : getById,
    add : insert,
    delete : DeleteRecod,
    edit : Update
  };