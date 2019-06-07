const axios = require('axios');



let transactions = [
    {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57l", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-11T21:08:05.405Z"},
    {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57k", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-18T21:08:05.405Z"},
    {"trans_id" : "sktwi1sc2jnrxt57i :: sktwi1sc2jnrxt57j", "user_id" : "sktwi1sc2jnrxt3yf-1", "name": "Walmart", "amount" : 50,"date" : "2018-10-25T21:08:05.405Z"}
];

//method to test POST request
/*
axios.post('http://127.0.0.1:1984/', {
    transactions
})
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.log(error);
}); 
*/


//method to test GET request
axios.get('http://127.0.0.1:1984/')
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.log(error);
});
