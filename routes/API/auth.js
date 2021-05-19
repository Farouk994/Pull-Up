const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.post(
  "/",
  [
    check("email", "Please use valid email on file").isEmail(),
    check(
      "password",
      "Use valid Password associated with account with 6 or more characters"
    ).exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).send({ errors: [{ msg: "Invalid User Information" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5000000" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).json("Server Error");
    }
  }
);

module.exports = router;
