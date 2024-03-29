// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities"); 
const regValidate = require('../utilities/account-validation.js')

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.accountManagement));


router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.get("/update",  utilities.handleErrors(accountController.BuildUpdateView))
router.get("/delete", utilities.checkLogin, utilities.handleErrors(accountController.BuildDeleteView));

router.post(
  "/delete", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.deleteAccount)
  );

router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

 // Process the login attempt
 router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

router.post("/update",  regValidate.updateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))

router.post("/change", regValidate.updatePasswordRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updatePassword))

router.get("/logout",  utilities.checkLogin, utilities.handleErrors(accountController.logout))

module.exports = router;