const utilities = require("../utilities/");
const accountModel = require("../models/account-model")

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
      messages: req.flash('notice'),
    });
  } catch (error) {
    console.error('Error in buildLogin:', error);
    next(error);
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  let grid = await utilities.buildRegister("Register", "");
  res.render("account/register", {
    title: "Register",
    nav,
    messages: req.flash('notice'),
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
 
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
 
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
    
module.exports = { buildLogin, buildRegister, registerAccount }