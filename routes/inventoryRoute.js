// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities"); 


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleDetails));

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/intentional-error", (req, res, next) => {
    throw new Error("Intentional 500-type error");
  });

module.exports = router;