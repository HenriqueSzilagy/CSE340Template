 const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validater = {}
const inventoryModel = require("../models/inventory-model")

validater.inventoryRules = () => {
  return [
      body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage('Enter valid Make')
      .custom(value => !/\s/.test(value))
      .withMessage('No spaces are allowed in the Make'),

      body("inv_model")
      .trim()
      .isLength({min: 1})
      .withMessage("Enter valid Model"),

      body("inv_year")
      .trim()
      .isLength({ min: 4})
      .withMessage("Enter valid year")
      .isLength({ max: 4})
      .withMessage("Enter 4 numbers only for year"),

      body("inv_description")
      .trim()
      .isLength({ min: 1})
      .withMessage("Enter description"),

      body("inv_image")
      .trim()
      .isLength({min: 1})
      .withMessage("Enter image path"),

      body("inv_thumbnail")
      .trim()
      .isLength({min: 1})
      .withMessage("Enter image thumbnail path"),

      body("inv_price")
      .trim()
      .isLength({min: 1})
      .withMessage("Enter valid price without symbol, comma and period"),

      body("inv_miles")
      .trim()
      .isLength({min: 1})
      .withMessage("Enter miles without symbol, comman and period"),

      body("inv_color")
      .trim()
      .isLength({min: 1})
      .withMessage("Enter color"),
  ]
}

  
  /* ******************************
   * Check data and return errors or continue to Inventory addition
   * ***************************** */
  
  
  
  
  validater.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,  inv_color, classification_id} = req.body
    let classification = await utilities.selectClassification(classification_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav(); 
      res.render("inventory/add-inventory", {
        errors,
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
      });
      return;
    }
  
    next(); // Move to the next middleware (or route handler) if there are no validation errors
  };
  
  
    module.exports = validater 
    