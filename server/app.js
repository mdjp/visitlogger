'use strict';

const requestIp = require('request-ip');
const http = require('http');
const bodyParser = require('body-parser');
const loader = require('json-load');
const express = require('express');
const Datastore = require('nedb');
const cors = require('cors');
const config = loader('config/main.json');
const app = express();
const db = new Datastore({
  filename: config.dbpath,
  autoload: true
});


function logvisit(req) {
  const data = req.body;
  const ipaddr = requestIp.getClientIp(req);
  const date = new Date();
  const timestamp = Math.round(date.getTime() / 1000);
  const agent = req.headers['user-agent'];
  const visit = {
    ts: timestamp,
    uid: data.uid,
    key: data.key,
    value: data.value,
    campaign: data.campaign,
    ip: ipaddr,
    uagent: agent,
    page: req.headers.referer
  };
  db.insert(visit);
}

function validatepost(data) {
  if (data.key && data.value && data.campaign && data.uid) {
    return true;
  }
  return false;
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

http.createServer(app).listen(config.port);

app.get('/visitlogger', (req, res) => {
  res.send(config.appname);
});

app.post('/visitlogger/logvisit', (req, res) => {
  if (validatepost(req.body)) {
    logvisit(req);
    res.send('OK');
  } else {
    res.send('ERROR');
  }
});

app.get('/visitlogger/viewhtml', (req, res) => {
var response = [];;
var returnstring = "";
db.find({}, function (err, docs) {
docs.forEach(function(doc){
response.push(JSON.stringify(doc) + "<br><br>");
})
response.forEach(function(line){
returnstring += line;
})
res.send(returnstring);
});
});

app.get('/visitlogger/viewjson', (req, res) => {
db.find({}, function (err, docs) {
res.send(docs);
});

});


