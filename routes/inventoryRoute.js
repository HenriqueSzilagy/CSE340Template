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

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView));

router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventortView))

router.post("/delete", utilities.handleErrors(invController.deleteInventory))


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

  // handle the incoming request
  router.post("/update/", 
  validater.inventoryRules(),
  validater.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))


router.get("/intentional-error", (req, res, next) => {
    throw new Error("Intentional 500-type error");
  });

module.exports = router;