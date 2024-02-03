const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get details of a specific vehicle by inv_id
 * ************************** */
async function getVehicleDetails(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0]; // Assuming you expect only one result
  } catch (error) {
    console.error("getVehicleDetails error: ", error);
    throw error;
  }
}

function isValidClassificationName(classification_name) {
  const pattern = /^[^\s]+$/;
  return pattern.test(classification_name);
}


/* *****************************
*   Add new classification
* *************************** */
async function addNewClassification(classification_name){
  try {
    // Validar o nome da classificação
    if (!isValidClassificationName(classification_name)) {
      throw new Error("Invalid classification name. It should not contain spaces or special characters.");
    }
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.messages
  }
}

/* *****************************
*   Add new Vehicle
* *************************** */
async function addNewVehicle(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color){
  try {
    // Validar o nome da classificação
    if (!isValidClassificationName(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)) {
      throw new Error("Invalid vehicle information.");
    }
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inc_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
  } catch (error) {
    return error.messages
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleDetails, addNewClassification, isValidClassificationName, addNewClassification};

