
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const port = 1880;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

server.listen(port, function () {
    console.log(`Server is listening on ${port}!`)
})

// Connection URL
var url = 'mongodb+srv://lapis:ffzgap0894990083@cluster0.3gtas.mongodb.net/scg_test?retryWrites=true&w=majority';
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    var db = client.db('scg_test');
    wss.on('connection', function connection(ws) {
        console.log('connect');
        db.collection('bus_tracking').find({}).toArray(function (err, docs) {
            if (err) {
                throw err;
            }
            console.log("Found the following records");
            console.log(docs);
            ws.send(JSON.stringify(docs))

        });
        watchdb = db.collection('bus_tracking').watch()
        db.collection('bus_tracking').watch({ fullDocument: "updateLookup" }).on("change", next => {
            console.log(next["fullDocument"]);
            ws.send(JSON.stringify(next["fullDocument"]));
        })
    })

})


