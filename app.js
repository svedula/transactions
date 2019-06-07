const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

let app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Computes difference in dates 
let date_diff_indays = function(date1, date2) {
    dt1 = new Date(date1);
    dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}
// Adds specified number of days to the specified date
function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
// Gets date in the yyyy/mm/dd format
function getDate(d){
    
    result = d.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");
    if(null != result) {
        dateSplitted = result[0].split(result[1]);
        day = dateSplitted[0];
        month = dateSplitted[1];
        year = dateSplitted[2];
    }
    result = d.match("[0-9]{4}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}");
    if(null != result) {
        dateSplitted = result[0].split(result[1]);
        day = dateSplitted[2];
        month = dateSplitted[1];
        year = dateSplitted[0];
    }
    return year+"/"+month+"/"+day;
}
// Gets elements with the same date as the specified date from the input array
function findSameDateElems(addedDate, inputArray, foundElements) {
    for(let l = 0; l < inputArray.length; l++){
        if(getDate(inputArray[l].date) === getDate(addedDate)){
            foundElements.push(inputArray[l]);
        }
    }
}
// Checks if the element exists in the output array, if not adds the element
function existElem(elem, diff, check, final, outputArray){
    for(let o = 0; o < outputArray.length; o++){
        if(outputArray[o].name === elem.name){
            if(!outputArray[o].transactions.includes(elem)){
                outputArray[o].transactions.push(elem);
                outputArray[o].next_amt = addDays(elem.date, diff);
                check = true;
            }
        }
    }
    if(check){
        return;
    }
    if(!final.transactions.includes(elem)){
        final.transactions.push(elem);
    }
}
// Checks if the amount is equal and adds the elem
function amountCheck(compElem, currElem, foundElements, diff, check, final, outputArray){
    for(let m = 0; m < foundElements.length; m++){
        if(currElem.amount === foundElements[m].amount){
            existElem(compElem, diff, check, final, outputArray);
            existElem(currElem, diff, check, final, outputArray);
            existElem(foundElements[m], diff, check, final, outputArray);
        }
    }
}
// Assigns values to different parameters of the output array
function assignValues(diff, final, outputArray){
    let last_val = final.transactions[final.transactions.length - 1];
    final.name = last_val.name;
    final.user_id = last_val.user_id;
    let succ = addDays(last_val.date, diff);
    final.next_amt = succ;
    outputArray.push(final);  
}
// Gets recurring transactions from the input array
function getRecurringTransactions(inputArray){
    // Variables
    let final = {};
    final.transactions = [];
    let foundElements = [];
    let outputArray =[];
    let check = false;
    for(var i = 0; i < inputArray.length; i++){
        for(var j = i + 1; j < inputArray.length; j++){
            if(inputArray[j].amount === inputArray[i].amount){
                var i_date = getDate(inputArray[i].date);
                var j_date = getDate(inputArray[j].date);
                var diff = (date_diff_indays(i_date,j_date));
                var addedDate = addDays(j_date, diff);
                addedDate = addedDate.toISOString().substring(0, 10);
                findSameDateElems(addedDate, inputArray, foundElements);
                if(foundElements.length){
                    amountCheck(inputArray[i],inputArray[j],foundElements,diff, check, final, outputArray);
                    if(!check){
                        assignValues(diff, final, outputArray);
                    }
                    foundElements = [];
                }
            }
        }
        check = false;
        final = {};
        final.transactions = [];
    }
    return outputArray;
}

//POST API that inserts incoming records into the database and reuturns recurring transactions as response
app.post('/', function (req, res) {
    
    let inputTransactions = req.body.transactions;
    // console.log(inputTransactions);
    //insert records from input array to collection
    MongoClient.connect(url, {useNewUrlParser:true}, function(err, db){
        let dbo = db.db("interview_challenge");
        dbo.collection("transactions").insertMany(inputTransactions, function(err, res) {
            console.log("Number of documents inserted: " + res.insertedCount);
        });
        //read database and getrecurring transactions
        dbo.collection("transactions").find({}).toArray(function(err, result) {
            let recurringTransactions = getRecurringTransactions(result);
            res.send(recurringTransactions);
            db.close();
        });
    });
})

// GET method that returns just recurring transactions
app.get('/', function (req, res) {

    MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
        var dbo = db.db("interview_challenge");
        dbo.collection("transactions").find({}).toArray(function(err, result) {
            let recurringTransactions = getRecurringTransactions(result);
            res.send(recurringTransactions);
            db.close();
        });
    });
    
})

var server = app.listen(1984, function () {
    var host = server.address().address
    var port = server.address().port 
    console.log("Example app listening at http://%s:%s", host, port)
})