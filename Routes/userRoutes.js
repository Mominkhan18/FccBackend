const express=require("express");
const {registerUser,loginUser,findUser,getUsers, verifyOTP, sendEmail}=require('../Controllers/userContoller')


const router=express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/email",sendEmail)
router.post('/verifyotp',verifyOTP)
router.get('/find/:userId',findUser)
router.get('/',getUsers)

module.exports=router;