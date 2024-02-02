const utilities = require("../utilities/");
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
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


/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Authenticate the user
  const authResult = await accountModel.authenticateAccount(account_email, account_password);

  if (authResult) {
    req.session.user = authResult; // Assuming you have a session handling middleware
    res.redirect("/dashboard"); // Redirect to the dashboard or any other page after successful login
  } else {
    req.flash("error", "Invalid email or password. Please try again.");
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      account_email,
    });
  }
}

module.exports = {
  registerAccount,
  loginAccount,
};



module.exports = { buildLogin, buildRegister, registerAccount, loginAccount,}