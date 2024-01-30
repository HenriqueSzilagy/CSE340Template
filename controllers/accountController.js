const utilities = require("../utilities/");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    let grid = await utilities.buildLogin("Login", ""); 

    res.render("account/login", {
      title: "Login",
      nav,
      grid, 
    });
  } catch (error) {
    console.error('Error in buildLogin:', error);
    next(error);
  }
}

module.exports = { buildLogin };



