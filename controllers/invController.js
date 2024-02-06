
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

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
  const nav = await utilities.getNav()
  res.render("./inventory/details", {
    title: "Vehicle Details",
    nav,
    details: vehicleData,
    grid,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
 
invCont.buildManagement = async function(req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.selectClassification()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  });
};

invCont.intentionalError = (req, res, next) => {
  throw new Error("Intentional 500-type error");
};


/* ****************************************
*  Deliver add classification view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
};

/* ****************************************
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classification = await utilities.selectClassification();
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body;
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classification,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors: null,
    });
};

/* ****************************************
*  Process add-Classification
* *************************************** */
invCont.addNewClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const addResult = await invModel.addNewClassification(classification_name);

  if (addResult) {
    await utilities.updateNav(); // Chame a função de atualização da navegação
    req.flash("notice", `Successfully added ${classification_name} classification.`);
    res.status(201).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav, 
      errors:null,
    });
  } else {
    req.flash("notice", `Failed to add ${classification_name} classification.`);
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav, 
      errors:null,
    });
  }
};

/* ****************************************
*  Process add-Inventory
* *************************************** */
invCont.addNewVehicle = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    let classification = await utilities.selectClassification(); // Adicionado parênteses
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    const addResult = await invModel.addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
    
    if (addResult) {
      req.flash("notice", `Successfully added a new vehicle.`);
      res.status(201).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classification,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        errors: null,
      });
    } else {
      req.flash("notice", `Failed to add a new vehicle classification.`);
      res.status(501).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classification,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        errors: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};





module.exports = invCont

