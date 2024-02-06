const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the select drop down
 ************************** */
Util.selectClassification = async function (selectedClassificationId) {
  let data = await invModel.getClassifications();
  let select = '<label for="classification_id">Classification: </label>';
  select += '<select id="classification_id" name="classification_id">';
  data.rows.forEach((row) => {
    select += '<option value="' + row.classification_id + '"';
    if (row.classification_id == selectedClassificationId) {
      select += ' selected';
    }
    select += '>' + row.classification_name + '</option>';
  });
  select += '</select>';
  return select;
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildVehicleDetailGrid = async function(details) {
  let grid = '';

  if (details) {
    grid += '<h1 id="vehicle-title">' + details.inv_year + ' ' + details.inv_make + ' ' + details.inv_model + '</h1>';
    grid += '<div class="vehicle-details">';
    grid += '<div>';
    grid += '<img src="' + details.inv_image + '" alt="' + details.inv_make + ' ' + details.inv_model + '">';
    grid += '</div>';
    grid += '<div class="text-container">';
    grid += '<h2>' + details.inv_make + ' ' + details.inv_model + ' Details</h2>';
    grid += '<p class="intercalate"><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(details.inv_price) + '</p>';
    grid += '<p><strong>Description:</strong> ' + details.inv_description + '</p>';
    grid += '<p class="intercalate"><strong>Color:</strong> ' + details.inv_color + '</p>';
    grid += '<p><strong>Miles:</strong> ' + details.inv_miles.toLocaleString('en-US') + '</p>';
    grid += '</div>';
    grid += '</div>';
  } else {
    grid = '<p>Details not found.</p>';
  }

  return grid;
};

Util.updateNav = async function () {
  // Implemente a lógica para buscar os dados mais recentes da navegação
  // Certifique-se de chamar a função correta do invModel para buscar os dados de navegação
  const latestNav = await invModel.getClassifications();
  return latestNav;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util