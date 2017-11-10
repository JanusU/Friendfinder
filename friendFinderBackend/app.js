const express = require('express');
const app = express();
const PORT = 3000;
const register = require("./facade/FriendFacade");



app.get('/', function (req, res) {
  res.send('Friend Finder Demo!')
})

app.listen(PORT, function () {
  console.log(`Friend Finder App listening on port ${PORT}`);
})

app.post('/friends/register/:distance', function(req, res){
  let json = JSON.parse(req.body);
  register(json.userName, json.coordinates, req.params.distance, function(err,docs){
    if(err){
      return console.log("ERROR",err)
    }
    res.send(JSON.stringify(docs,null,""));
  });
})


