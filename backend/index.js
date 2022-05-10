//'use strict'
const CONFIG = require('../config.json')
const express = require('express')
const bodyParser = require("body-parser")
const cors = require("cors")
// Create the express app
const app = express(cors())
//var {id: 1, speaker:"john", country: "au"}
var sodas = new Map()
sodas.set("Fizz", {
  "Product Name": "Fizz",
  "description": "An effervescent fruity experience with hints of grape and coriander.",
  "Cost": 1.00,
  "CurrentQuantity": 100,
  "MaxQuantity": 100
})

sodas.set("Pop", {
  "Product Name": "Pop",
  "description": "An effervescent fruity experience" +
    "with hints of grape and coriander.",
  "Cost": 1.00,
  "CurrentQuantity": 100,
  "MaxQuantity": 100
})

sodas.set("Cola", {
  "Product Name": "Cola",
  "description": "A basic no nonsense cola" +
    "that is the perfect pick me up for any occasion.",
  "Cost": 1.00,
  "CurrentQuantity": 200,
  "MaxQuantity": 200
})

sodas.set("Mega Pop", {
  "Product Name": "Mega Pop",
  "description": "Not for the faint of heart." +
    "So flavorful and so invigorating, it should probably be illegal.",
  "Cost": 1.00,
  "CurrentQuantity": 50,
  "MaxQuantity": 50
})
// Routes and middleware
// app.use(/* ... */)
// app.get(/* ... */)
app.use(function (req, res, next) {
  //    res.header("lety: Origin", "true")
  const corsWhitelist = [
    'http://localhost:8080',
    'http://localhost:3000',
  ]
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  }
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT, DELETE')

  next()
})
// middleware
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
// Error handlers

app.use(function fiveHundredHandler(err, req, res, next) {
  console.error(err)
  res.status(500).send()
})

// routes

//get all sodas
app.get("/colas", async (req, res) => {
  res.send(JSON.stringify(Array.from(sodas.values())))
})

// routes
app.get("/colas/:id", async (req, res) => {
  const soda = sodas.get(req.params.id)
  res.send(JSON.stringify(soda))
})
const isValid = (soda) => {
  if (soda["Product Name"] !== undefined && typeof (soda.cost) === 'number' &&
    soda.MaxQuantity > 0 && soda.CurrentQuantity > 0) {
    return true
  }
  return false
}
// add new soda
app.post("/colas", async (req, res) => {
  console.log(req.body)
  const valid = isValid(req.body)
  if (!sodas.has(req.body["Product Name"]) && valid) {
    if (req.body.description === undefined) {
      req.body.description = ""
    }
    req.body.CurrentQuantity = req.body.MaxQuantity
    sodas.set(req.body["Product Name"], req.body)
    res.status(201)
    return
  }
  else if (valid) {
    res.send("Already here, updated instead")
    sodas.set(req.body["Product Name"], req.body)
    return
  }
  else {
    res.status(403)
    res.send("Invalid Type")
    return
  }
})
// modify soda
// add new soda
app.put("/colas", async (req, res) => {
  {
    console.log(req.body)
    if (!sodas.has(req.body["Product Name"])) {
      if (req.body.Cost === undefined)
      {
        req.body.Cost = 1.0
      }
      sodas.set(req.body["Product Name"], req.body)
    }
  }
  res.send("Already here, updated instead")
})

app.delete("/colas", async (req, res) => {

  if (sodas.has(req.body["Product Name"])) {
    sodas.delete(req.body["Product Name"])
    res.send("Deleted " + req.body["Product Name"])
  }
  else {
    res.send(req.body["Product Name"] + " Was not found")
    res.status(404)
    return
  }

})
// Start server
app.listen(CONFIG.backendPort, function (err) {
  if (err) {
    return console.error(err)
  }

  console.log('Started at ' + CONFIG.backendHost + ':' + CONFIG.backendPort)
})
