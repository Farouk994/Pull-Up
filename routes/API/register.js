// This is a POST request that will be authenticating users to enable a secure login/registration 
// into the database

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");


const User = require("../../models/user");
router.post(
  "/",
  // First, we AUTHENTICATE user input to make sure we elimate any errors before we add them into
  // the database
  [
    check("name", "Please provide a valid Name").not().isEmpty(),
    check("email", "Please provide a valid email to register").isEmail(),
    check("password", "Please provide 6 characters or more").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User has Logged In");
  }
);

module.exports = router;
