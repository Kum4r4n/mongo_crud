const { Module } = require('module');
const {MongoClient} = require('mongodb');
var CONFIG = require('./config.json');


//get mongo db connection client
function  GetMongoclient(){

    var uri = CONFIG.mongoDbUrl
    const client = new MongoClient(uri);  
    client.connect();
    return  client;
    
};

//export modules
module.exports = {

    getClient : GetMongoclient

}


  


