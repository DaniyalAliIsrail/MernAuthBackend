import express from "express";
import userdb from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import cookieParser from "cookie-parser";
import authenticate from "../middleware/authenticate.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  const { fname, email, password, cpassword } = req.body;
  if (!fname || !email || !password || !cpassword) {
    return res.status(400).send({ error: "fill all the details" });
  }
  try {
    const preUser = await userdb.findOne({ email: email });
    if (preUser) {
      res.status(400).send({ error: "This email is already used" });
    } else if (password !== cpassword) {
      return res
        .status(400)
        .send({ error: "Password and confirm Password Not Match" });
    } else {
      const finalUser = new userdb({ fname, email, password, cpassword });
      //passowrd hash in userschema page
      const storeData = await finalUser.save();
      res.status(200).json({status:200,storeData})
    }
  } catch (err) {
    console.log("catch block error");
    return res.status(400).send({ error:  "An error occurred during registration"});
  }
});
//login
router.post("/login",async(req,res)=>{
  console.log(req.body);
  const {email,password} = req.body
  if(!email || !password){
  res.status(400).json({error:"Fill all the details"}) 
  }
  try{
    const userValid = await userdb.findOne({email:email});
    console.log(userValid);
    if(userValid){
      const isMatch = await bcryptjs.compare(password,userValid.password);
      if(!isMatch){
        res.status(400).send({error:"invalid details"})
      }else{
        //create tokene
        const token = await userValid.generateAuthtoken();
        console.log(token);
        //create cookiesGenrate
        res.cookie("usercookie",token,{
          expires:new Date(Date.now()+9000000),
          httpOnly:true
        })
        const result = {
          userValid,
          token
        }
        res.status(200).json({status:201,result})
      }
    }
  }catch(error){
}
})

router.get("/validuser",authenticate,async(req,res)=>{
  try{
    const validUserOne = await userdb.findOne({_id:req.userId})
    res.status(200).json({status:200,validUserOne})
  }catch(error){
    res.status(400).json({status:400,error})
  }
})

router.get("/logout",authenticate,(req,res)=>{
  try{
    //jo token match nhy huwa wo req.rootUsertoken may save ho jae ga:
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem)=>{
      return curelem.token !== req.token 
    })
    res.clearCookie("usercookie",{path:"/"});
    req.rootUser.save()
    res.status(200).json(req.rootUser.tokens)
  }catch(error){
    res.status(400).json({status:400,message:error})
  }
})
router.get("/logout", authenticate, async (req, res) => {
  try {
    // Filter out the token that matches the request token
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });
    // Save the modified user document
    await req.rootUser.save();
    // Clear the user cookie and send a success response
    res.clearCookie("usercookie", { path: "/" });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message }); // Sending a more specific error message
  }
});
export default router;
