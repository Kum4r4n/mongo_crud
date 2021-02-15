//initialize readline
const readline = require("readline");
var { getClient } = require('./client');
var service = require('./service');

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//get mongo client
var clientConnection =  getClient();
//connect client
clientConnection.connect();


//ask main question to user !
read.question("What do you want to do ! \n 1 => Get all databases \n 2 => Get all data \n 3 => Get by Id \n 4 => Add record \n 5 => Update \n 6 => Delete \n\n",function(selection){

    switch (selection) {
        case "1":
            GetAllDatabase(clientConnection);
            break;
        case "2":
            GetAllCollectionData(clientConnection);
            break;
        case "3":
            GetById(clientConnection);
            break;
        case "4":
            AddRecord(clientConnection);
        case "5":
            Update(clientConnection);
            break;
        case "6":
            DeleteRecord(clientConnection);
            break;
        default:
            break;
    }
});


async function GetAllDatabase (clnt){

    var databasesList = await service.getallDatabases(clnt);
    databasesList.databases.forEach(db => console.log(` - ${db.name}`))
    finish();
}


async function GetAllCollectionData (clnt){

    var dbo = await service.getDb(clnt);
    await service.getData(dbo);
    finish();
}

async function GetById(clnt){

    read.question("\n please enter document Id \n", async function(id){

        var dbo = await service.getDb(clnt);
        await service.get(dbo, id)
        finish();
        
    });

    
}


async function AddRecord(clnt){

    read.question("please input Transport type : - \n", async function(type){

        read.question("please input Domestic transport emissions percentage for 2018 : - \n", async function(emission_value){

            transport_data  = {

                "Transport_type" : type,
                "Domestic_transport_emissions_2018" : emission_value
            }

            var dbo = await service.getDb(clnt);
            await service.add(dbo, transport_data);
            finish();

        });

    });

}


async function DeleteRecord(clnt){

    read.question("please input id for delete : - \n", async function(requested_id){

        var dbo = await service.getDb(clnt);
        await service.delete(dbo, requested_id );
        finish();

    });

}


async function Update(clnt){

    read.question("please input id for get data before update : - \n", async function(requested_id){

        var dbo = await service.getDb(clnt);
        await service.get(dbo, requested_id );

        console.log("insert new values \n");

        read.question("please input Transport type : - \n", async function(type){

            read.question("please input Domestic transport emissions percentage for 2018 : - \n", async function(emission_value){
    
                transport_data  = {
    
                    "Transport_type" : type,
                    "Domestic_transport_emissions_2018" : emission_value
                }

                await service.edit(dbo, transport_data, requested_id );
                finish();
    
            });
    
        });

    });

}

function finish(){

    read.question("\n press any key to exit.. \n", function(pressed){
        clientConnection.close();
        process.exit();
    });
}