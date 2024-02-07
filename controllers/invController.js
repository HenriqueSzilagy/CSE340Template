
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
    let classification = await utilities.selectClassification(); 
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
*  Build edit inventory view
* ************************** */
invCont.editInventoryView  = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleDetails(inv_id);
    const classificationSelect = await utilities.selectClassification(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.selectClassification(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}


// Delete inventory view
invCont.buildDeleteInventortView  = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleDetails(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "delete " + itemName,
  nav,
  errors: null,
  inv_id: itemData.inv_id,
  inv_make: itemData.inv_make,
  inv_model: itemData.inv_model,
  inv_year: itemData.inv_year,
  inv_price: itemData.inv_price,
})
}

//Delete inventory
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", `The delete was successfully .`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("inv/delete/(inv_id)")
    }
  }



module.exports = invCont;

