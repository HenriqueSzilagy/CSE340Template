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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util


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


Util.buildLogin = async function (title, flashMessage) {
  try {
    let grid = `<h1 id=login>${title}</h1>`;
    grid += '<div id=loginBlock>';
    grid += '<form action="/account/login" method="post">';
    grid += '<label for="account_email">Email Address:</label>';
    grid += '<input type="text" id="account_email" name="account_email" required>';

    grid += '<label for="account_password">Password:</label>';
    grid += '<input type="password" id="account_password" name="account_password" required>';

    grid += '<p>' + 'Password must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character' + '</p>'
    grid += '<span id="pswdBtn">Show Password</span>';

    grid += '<button type="submit">Login</button>';

    grid += '</form>';
    grid += '<p>Don\'t have an account? <a href="/account/register">Register here</a>.</p>';
    grid += '</div>';
    if (flashMessage) {
      grid += `<p>${flashMessage}</p>`;
    }

    console.log('Grid after form:', grid);

    grid += `
    <script>
      const pswdBtn = document.querySelector("#pswdBtn");
      pswdBtn.addEventListener("click", function() {
        const pswdInput = document.getElementById("account_password");
        const type = pswdInput.getAttribute("type");
        if (type == "password") {
          pswdInput.setAttribute("type", "text");
          pswdBtn.innerHTML = "Hide Password";
        } else {
          pswdInput.setAttribute("type", "password");
          pswdBtn.innerHTML = "Show Password";
        }
      });
    </script>
  `;

  console.log('Grid after form:', grid);

  return grid;
} catch (error) {
  // Handle errors if needed
  console.error('Error in buildLogin:', error);
  throw error; // Rethrow the error to be caught by the error handler
}
};

Util.buildRegister = async function (title, flashMessage) {
  try {
    let grid = `<h1 id=register>${title}</h1>`;
    grid += '<div id=registerBlock>';
    grid += '<form action="/account/register" method="post">';
    
    grid += '<label for="account_firstname">First Name:</label>';
    grid += '<input type="text" id="account_firstname" name="account_firstname" required>';

    grid += '<label for="account_lastname">Last Name:</label>';
    grid += '<input type="text" id="account_lastname" name="account_lastname" required>';

    grid += '<label for="account_email">Email Address:</label>';
    grid += '<input type="text" id="account_email" name="account_email" required>';

    grid += '<label for="account_password">Password:</label>';
    grid += '<input type="password" id="account_password" name="account_password" required>';

    grid += '<p>' + 'Password must be minimum of 12 characters and include 1 capital letter, 1 number and 1 special character' + '</p>'
    grid += '<span id="pswdBtn">Show Password</span>';

    grid += '<button type="submit">Register</button>';

    grid += '</form>';
    grid += '</div>';
    if (flashMessage) {
      grid += `<p>${flashMessage}</p>`;
    }

    grid += `
    <script>
      const pswdBtn = document.querySelector("#pswdBtn");
      pswdBtn.addEventListener("click", function() {
        const pswdInput = document.getElementById("account_password");
        const type = pswdInput.getAttribute("type");
        if (type == "password") {
          pswdInput.setAttribute("type", "text");
          pswdBtn.innerHTML = "Hide Password";
        } else {
          pswdInput.setAttribute("type", "password");
          pswdBtn.innerHTML = "Show Password";
        }
      });
    </script>
  `;

  console.log('Grid after form:', grid);

  return grid;
} catch (error) {
  // Handle errors if needed
  console.error('Error in buildLogin:', error);
  throw error; // Rethrow the error to be caught by the error handler
}
};





