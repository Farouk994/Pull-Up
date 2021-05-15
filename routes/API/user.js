const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("User has Logged In");
});

module.exports = router;