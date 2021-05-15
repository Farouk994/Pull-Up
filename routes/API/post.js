const express = require("express");
const router = express.Router();

router.post("/",(req,res)=>{
    res.send("User has Posted");
});

module.exports = router;