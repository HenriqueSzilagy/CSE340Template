const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classificationName is required and must not contain spaces or special characters
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Classification name cannot contain spaces or special characters."),
    ];
  };
  
  /* ******************************
   * Check data and return errors or continue to classification addition
   * ***************************** */
  validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav(); 
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      });
      return;
    }
  
    next(); // Move to the next middleware (or route handler) if there are no validation errors
  };
  
  
    module.exports = validate