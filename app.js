const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

let app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// Inputs
// let my_array = [
//     {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57l", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-11T21:08:05.405Z"},
//     {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57k", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-18T21:08:05.405Z"},
//     {"trans_id" : "skti :: sktl", "user_id" : "sktf-1", "name": "Target", "amount" : 100,"date" : "2018-10-10T21:08:05.405Z"},
//     {"trans_id" : "skti :: sktk", "user_id" : "sktf-1", "name": "Target", "amount" : 100,"date" : "2018-10-20T21:08:05.405Z"},
//     {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57j", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-25T21:08:05.405Z"},
//     {"trans_id" : "skti :: sktj", "user_id" : "sktf-1", "name": "Target", "amount" : 100,"date" : "2018-10-30T21:08:05.405Z"},
//     {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57j", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-11-01T21:08:05.405Z"}

// ];
// let inArray = [
//     {
//       _id: '5cfac941e5a4279a3135fb1d',
//       trans_id: 'pnz19kugnjwmjmz1z::pnz19kugnjwmjmz22',
//       user_id: 'pnz19kugnjwmjmw7o-1',
//       name: 'Netflix',
//       amount: 13.99,
//       date: '2019-04-05T20:29:53.013Z'
//     },
//     {
//       _id: '5cfac941e5a4279a3135fb1e',
//       trans_id: 'pnz19kugnjwmjmz1z::pnz19kugnjwmjmz21',
//       user_id: 'pnz19kugnjwmjmw7o-1',
//       name: 'Netflix',
//       amount: 13.99,
//       date: '2019-05-05T20:29:53.013Z'
//     },
//     {
//       _id: '5cfac941e5a4279a3135fb1f',
//       trans_id: 'pnz19kugnjwmjmz1z::pnz19kugnjwmjmz20',
//       user_id: 'pnz19kugnjwmjmw7o-1',
//       name: 'Netflix',
//       amount: 13.99,
//       date: '2019-06-05T20:29:53.013Z'
//     }
//   ];

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
    return foundElements;
}
// Checks if the element exists in the output array, if not adds the element
function existElem(elem, diff, check, final, outputArray){
    for(let o = 0; o < outputArray.length; o++){
        if(outputArray[o].name === elem.name){
            check = true;
            if(!outputArray[o].transactions.includes(elem)){
                outputArray[o].transactions.push(elem);
                outputArray[o].next_amt = addDays(elem.date, diff);

            }
        }
    }
    if(check){
        return check;
    }
    if(!final.transactions.includes(elem)){
        final.transactions.push(elem);
    }
    return check;
}
// Checks if the amount is equal and adds the elem
function amountCheck(compElem, currElem, foundElements, diff, check, final, outputArray){
    for(let m = 0; m < foundElements.length; m++){
        if(currElem.amount === foundElements[m].amount){
            check = existElem(compElem, diff, check, final, outputArray);
            check = existElem(currElem, diff, check, final, outputArray);
            check = existElem(foundElements[m], diff, check, final, outputArray);
        }
    }
    return check;
}
// Assigns values to different parameters of the output array
function assignValues(diff, final, outputArray){
    let last_val = final.transactions[final.transactions.length - 1];
    final.name = last_val.name;
    final.user_id = last_val.user_id;
    let succ = addDays(last_val.date, diff);
    final.next_amt = succ;
    outputArray.push(final); 
    return outputArray; 
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
                foundElements = findSameDateElems(addedDate, inputArray, foundElements);
                if(foundElements.length){
                    check = amountCheck(inputArray[i],inputArray[j],foundElements,diff, check, final, outputArray);
                    if(!check){
                        outputArray = assignValues(diff, final, outputArray);
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
// Call to the function
// getRecurringTransactions(inArray);

//POST API that inserts incoming records into the database and reuturns recurring transactions as response

app.post('/', function (req, res) {
    
    let inputTransactions = req.body;
    
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