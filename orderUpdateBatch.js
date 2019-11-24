var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
var fs = require('fs');
var request = require('request');
var csv = require('fast-csv');
var schedule = require('node-schedule');
var allOrders = [];
var refinedOrders = [];

//the batch job schedule to run every 55 mins
var rule = new schedule.RecurrenceRule();
rule.minute = 55;

schedule.scheduleJob(rule, function(){
    //using callback to execute the insert after the CSV file is read
    readCSV(insertMongoDb);

    //read CSV order file from a HTTP
    function readCSV(callback) {
        request('https://xxxxx').pipe(
        fs.createReadStream('dummyOrder.csv')
        .pipe(csv.parse({ headers: true }))
        .on('data', row => allOrders.push(row)));
        callback();
    }

    //connect to MongoDb and insert order
    function insertMongoDb() {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("customerOrder");
            //obtain the existing customer Id from the customer collection in the DB
            var p = Promise.resolve((dbo.collection("customer").find({}, { projection: { _id: 0, customerId: 1 } }).toArray())); 
            p.then(function(value){
                checkDB(value, addDB);
            })
            p.catch(error => console.log("Couldn't get customerId"));   

            //check if the customerId in the CSV matches with a customer ID in the database and creates a new array with only those orders that has customer ID in database
            function checkDB(existingCustomer, callback){
                for (var i = 0; i < allOrders.length; i++){
                    for(var j = 0; j < existingCustomer.length; j++){
                        if (allOrders[i].customerId.trim() === existingCustomer[j].customerId.trim()){
                            refinedOrders.push(allOrders[i]);
                        }
                    }
                }
                callback();
            }
            //adds the order into the MongoDb database
            function addDB() {
                refinedOrders.forEach(orderInsertFunc);
                function orderInsertFunc(newItem) {
                    var newOrder = {
                    orderId: newItem.orderId, customerId: newItem.customerId, item: newItem.items, quantity: newItem.quantity
                    };
                    dbo.collection("order").insertOne(newOrder, function (err, res) {
                        if (err) throw err;   
                        console.log("1 Document inserted!");
                    });
                }
           }
        db.close(); 
        });
    }
});
