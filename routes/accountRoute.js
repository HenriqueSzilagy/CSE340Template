// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities/index"); 


router.get('/', utilities.handleErrors(accController.myAccount));



module.exports = router;