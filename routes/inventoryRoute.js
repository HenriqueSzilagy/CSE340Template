// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities"); 
const validate = require("../utilities/addClassification-validation");
const validater = require("../utilities/addInventory-validation");



// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleDetails));

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/", utilities.handleErrors(invController.buildAddClassification));

router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));

router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));

router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification))

  router.post(
    "/add-inventory",
    validater.inventoryRules(),
    validater.checkInventoryData,
    utilities.handleErrors(invController.addNewVehicle))


router.get("/intentional-error", (req, res, next) => {
    throw new Error("Intentional 500-type error");
  });

module.exports = router;