// javascript version of using the Microsoft Azure Face API 

const fetch = require('node-fetch');                             // import package fetch for javascript 
const fs = require('fs');
const subscriptionKey = '6809d2c368654653a643c30af830f24a';      // use git ignore for privacy concerns
//const imgUrl = "https://image.shutterstock.com/image-photo/young-funny-woman-making-fish-260nw-544767610.jpg"       // uncomment for url
// const imgData = {           // uncomment for url
//    url: imgUrl              // uncomment for url
// }                           // uncomment for url
const imgData = fs.readFileSync("happy.jpeg");           // uncomment for binary data

fetch("https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=false&returnFaceAttributes=emotion", {
    method: "POST",
    headers: {
        // 'Content-Type': 'application/json',                 // uncomment for url
        'Content-Type': 'application/octet-stream',      // uncomment for binary data
        'Ocp-Apim-Subscription-Key': subscriptionKey        // Microsoft Azure Face Key for access to Face API
    },
    // body: JSON.stringify(imgData),                          // uncomment for url
    body: imgData,                                          // uncomment for binary data
}).then((request) => {
    //console.log(request.headers)                          // uncomment to view header types
    return request.json();                                   // returns request.json() and passes into the next argument as json
}).then((json) => {
    //console.log(json)                                     // uncomment to view all attributes
    const d = json[0]["faceAttributes"]["emotion"];         // sets d as the dictionary of emotions
    let topKey = "anger";
    for (key in d) {                                        // sets topKey as the strongest emotion with highest percentage
        if (d[key] > d[topKey]) {
            topKey = key;
        }
    }
    console.log(topKey, d[topKey])                          // displays strongest emotion and its percentage
})