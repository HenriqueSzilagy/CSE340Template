const pool = require("../database/")
const bcrypt = require("bcryptjs")



/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.messages
    }
  }

 

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.messages
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountDetails (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No account found")
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
        account_firstname,
        account_lastname,
        account_email,
        account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function changePassword(hashedPassword, account_id){
  try{
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [hashedPassword, account_id])
    return data.rows[0]
  }catch (error) {
    console.error("change password: "+ error)
  }
}

async function deleteAccount(account_id, account_password) {
  try {
    const accountData = await pool.query("SELECT account_password FROM public.account WHERE account_id = $1", [account_id]);
    
    if (accountData.rows.length === 0) {
      throw new Error("Account not found");
    }

    const storedPassword = accountData.rows[0].account_password;

    try {
      if (await bcrypt.compare(account_password, storedPassword)) {
        const deleteQuery = "DELETE FROM public.account WHERE account_id = $1 RETURNING *";
        const deleteResult = await pool.query(deleteQuery, [account_id]);

        if (deleteResult.rows.length === 0) {
          throw new Error("Failed to delete account");
        }

        return deleteResult.rows[0];
      } else {
        throw new Error("Incorrect password");
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  } catch (error) {
    console.error("Model error: " + error);
    throw error;
  }
}



module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountDetails, updateAccount, changePassword, deleteAccount};