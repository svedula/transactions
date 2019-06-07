const MongoClient = require('mongodb').MongoClient;

let url = "mongodb://localhost:27017/interview_challenge";
//creates a adatabase with a collection named interview_challenge
MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    
    console.log("Database created!");

    let dbo = db.db("interview_challenge");
    let collection = dbo.createCollection("transactions", function(err, res) {
        
        console.log("Collection created!");
    });
    db.close();
});


