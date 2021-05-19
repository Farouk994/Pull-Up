// This is a POST request that will be authenticating users to enable a secure login/registration
// into the database

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

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

    // Check if User exists in the database
    let { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .send({ errors: [{ msg: "USER ALREADY EXISTS !!" }] });
      }

      // Get Users Gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      console.log(user);

      // JsonWebToken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;

// validate user
// check if user exists
// hash password
