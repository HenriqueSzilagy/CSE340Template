const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
const invController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildVehicleDetails = async function (req, res, next) {
  const vehicleId = req.params.vehicleId; 
  const vehicleData = await invModel.getVehicleDetails(vehicleId)
  const grid = await utilities.buildVehicleDetailGrid(vehicleData)
  const nav = await utilities.getNav();
  res.render("./inventory/details", {
    title: "Vehicle Details",
    nav,
    details: vehicleData,
    grid,
  });
};
 
async function buildManagement(req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

invController.intentionalError = (req, res, next) => {
  throw new Error("Intentional 500-type error");
};

module.exports = { invCont, invController, buildManagement };
