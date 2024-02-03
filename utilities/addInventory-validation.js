/* const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validater = {}

validater.inventoryRules = () => {
    return [
      body('inv_make')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Inv make must be at least 3 characters.'),
  
      body('inv_model')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Inv model must be at least 3 characters.'),

      body('inv_price')
        .isNumeric()
        .withMessage('Inv price must be a number.'),
  
      body('inv_year')
        .isInt({ min: 1000, max: 9999 })
        .withMessage('Inv year must be a 4-digit year.'),
  
      body('inv_miles')
        .isNumeric()
        .withMessage('Inv miles must contain only digits.'),
    ];
  };
  
  /* ******************************
   * Check data and return errors or continue to Inventory addition
   * ***************************** */
  
  
  /*
  
  validater.checkInventoryData = async (req, res, next) => {
    const { 
        inv_make, 
        inv_model, 
        inv_price, 
        inv_year, 
        inv_miles, 
         } = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav(); 
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        inv_make, 
        inv_model, 
        inv_price, 
        inv_year, 
        inv_miles, 
      });
      return;
    }
  
    next(); // Move to the next middleware (or route handler) if there are no validation errors
  };
  
  
    module.exports = validater 
    */