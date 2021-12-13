/**
 * Required External Modules
 */
require('dotenv').config()
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const emailFinder = require('./utils/email-finder')

/**
 * App Variables & Configuration
 */
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || "8000";

/**
 * Routes Definitions
 */
app.get("/v1/find", (req, res) => {
  var employee = {first_name: req.query.fn, last_name: req.query.ln, website: req.query.website}
  emailFinder.findEmail(employee, (err, result) => {
    console.log(result);
    res.status(200).json({
      success: true,
      enriched: result.employee,
      query: req.query
    });
  })
});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
