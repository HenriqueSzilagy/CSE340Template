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
      message: req.flash('notice'),
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
    grid,  // Pass the 'grid' variable to the view
    message: req.flash('notice'),
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (regResult.rows.length > 0) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.redirect("/account/login"); // Redireciona para a tela de login
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.redirect("/account/register"); // Redireciona para a tela de registro em caso de falha
    }
  } catch (error) {
    console.error('Error in registerAccount:', error);
    let nav = await utilities.getNav();
    res.status(500).render("errors/error", {
      title: "Error",
      nav,
      grid: null,  // Defina grid como null ou como você preferir
      error: "Internal Server Error",
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }

