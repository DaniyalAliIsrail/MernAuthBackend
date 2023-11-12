import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken";

const keysecret = "daniyalaliisraildaniyalaliisrail";
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    Trime: true,
  },
  email: {
    type: String,
    required: true,
    uniquie: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 8,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//hasing password and confirm passowrd
userSchema.pre("save", async function (next) {
  if(this.isModified("password")){
    this.password = await bcryptjs.hash(this.password, 10);
    this.cpassword = await bcryptjs.hash(this.cpassword, 10);
  }
  next();
});
//token generate
userSchema.methods.generateAuthtoken = async function () {
  try {
    // jwt token 3 thing 1) userid ,secretkey and tokenexpiredate
    let tokengenrate = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: "1d"
    });
    // ye line concat karraha hay token ka filed kay sath
    this.tokens = this.tokens.concat({ token: tokengenrate });
    await this.save();
    return tokengenrate;
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
//create models
const userdb = new mongoose.model("users", userSchema);
export default userdb;
