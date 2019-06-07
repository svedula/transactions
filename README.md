# Recurring Transactions
This app finds recurring transactions from an input_array of transactions and returns them in the format specified.

This app assumes that mongo db is running on the system and active. The code used to initialize database will use default ports.

1. Run db.js using node db.js to create the database 'interview_challenge' and initialize the collection 'transactions' 
2. Run "node app.js" to start serving the endpoints and to accept data

Input: 
let inputArray = [
    {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57l", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-11T21:08:05.405Z"},
    {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57k", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-18T21:08:05.405Z"},
    {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57j", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-25T21:08:05.405Z"}
];
Output:
let output = [
    {"name" : "Walmart", "user_id" : "sktwi1sc2jnrxt3yf-1", "next_amt" : "2018-11-01T21:08:05.405Z", 
    "transactions" : [
        {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57j", "user_id": "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-25T21:08:05.405Z"},
        {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57k", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-18T21:08:05.405Z"},
        {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57l", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-11T21:08:05.405Z"}          
                    ]
    }   
];
