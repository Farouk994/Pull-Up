const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const auth = require("../../middleware/auth")

router.get("/", auth, async (req,res)=>{
   try{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user)
   } catch(err){
res.status(500).json("Server Error")
   }
});

module.exports = router;