var express = require("express")
var app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var cors = require("cors");
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var mysql = require("mysql")
//port
var HTTP_PORT = 5000

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/", (req, res, next) => {
	res.json({"message":"Your API works! (200)"});
	res.status(200);
})

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "INSERT PASS HERE",
  database: 'findyourfit'
})

connection.connect()



//get matches
app.get("/app/matches/:email", (req, res) => {
  var email = req.params.email
  connection.query('SELECT * FROM matches WHERE person1=? OR person2=?', [email, email], function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results)
  })
})

//get user info by id
app.get("/app/user/:id", (req, res) => {
  var id = req.params.id
  connection.query('SELECT * FROM accounts WHERE id=?', [id], function (error, results, fields){
    res.status(200).json(results)
  })
})

//get user info by email
app.get("/app/user/email/:email", (req, res) => {
  var email = req.params.email
  connection.query('SELECT * FROM accounts WHERE email=?', [email], function (error, results, fields){
    res.status(200).json(results)
  })
})

//get possible people- filter by distance
app.get("/app/ppl/:id", (req, res) => {
  var id = req.params.id
  connection.query('SELECT * FROM accounts WHERE id=?', [id], function (error,results,fields){
    var lat = results[0].latitude
    var long = results[0].longitude
    var email = results[0].email
    connection.query('SELECT * FROM accounts WHERE NOT EXISTS (SELECT * FROM seen WHERE seen.swiper = (?) AND seen.target = accounts.email) AND accounts.id <> ?', [email, id], function (error, results, fields) {
      for (let i=0; i<results.length; i++){
        var dist = getDistanceFromLatLonInKm(lat, long, results[i].latitude, results[i].longitude)
        results[i].distance = dist
      }
      var newResults = results.filter(person => person.distance <= 20)
      res.status(200).json(newResults)
    })
  })
})

//login call
app.post("/app/login", (req, res) => {
  var email = req.body.email
  var pass = req.body.pass
  connection.query('SELECT * FROM accounts WHERE email=? AND pass=?', [email, pass], function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0)
        res.status(200).json({'status': 1, 'id':results[0].id, 'email':results[0].email})
      else 
        res.status(401).json({'status':0})
    })
})

//register user
app.post("/app/register", (req, res) => {
  var email = req.body.email
  var pass = req.body.pass
  var inserts = [email, req.body.personName, req.body.img, pass, req.body.latitude, req.body.longitude, req.body.goal, req.body.experience, req.body.gender]
  connection.query('SELECT id FROM accounts WHERE email=?', [email], function (error, results, fields) {
      if (error) throw error;
      if (results.length == 0){
        connection.query('INSERT INTO accounts (email,personName, img, pass,latitude,longitude,goal,experience,gender) VALUES (?,?,?,?,?,?,?,?,?)', inserts, function (error, results, fields) {
          if (error) throw error;
          res.status(201).json({'status':1})
        })
      }
      else {
        res.status(401).json({'status': 0})
      }
    })
})

//handle left swipe
app.post("/app/left", (req,res) => {
  var swiper = req.body.swiper
  var target = req.body.target
  connection.query('INSERT INTO seen (swiper, target) VALUES (?,?)', [swiper, target], function (error, results, fields){
    if (error) throw error;
    res.status(201).json({'status':1})
  })
})

//handle right swipe
app.post("/app/right", (req,res) => {
  var swiper = req.body.swiper
  var target = req.body.target
  connection.query('SELECT * FROM likes WHERE swiper=? and target=?', [target, swiper], function (error, results, fields){
    if (error) throw error;
    if (results.length > 0){
      connection.query('INSERT INTO seen (swiper, target) VALUES (?,?)', [swiper, target], function (error, results, fields){
        if (error) throw error;
      })
      connection.query('INSERT INTO matches (person1, person2) VALUES (?,?)', [swiper, target], function (error, results, fields){
        if (error) throw error;
      })
      res.status(200).json({'foundMatch':1})
    }
    else {
      connection.query('INSERT INTO likes (swiper, target) VALUES (?,?)', [swiper, target], function (error, results, fields){
        if (error) throw error;
      })
      connection.query('INSERT INTO seen (swiper, target) VALUES (?,?)', [swiper, target], function (error, results, fields){
        if (error) throw error;
      })
      res.status(200).json({'foundMatch':0})
    }
  })
  res.status(200)
})

//catch any undefined calls
app.use(function(req, res){
  res.json({"message":"Endpoint not found. (404)"});
    res.status(404);
});