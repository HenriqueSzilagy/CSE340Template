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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util