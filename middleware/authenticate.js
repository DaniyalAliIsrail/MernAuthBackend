import jwt from "jsonwebtoken";
import userdb from "../models/userSchema.js";
const keysecret = "daniyalaliisraildaniyalaliisrail";

const authenticate = async (req, res, next) => {
        try{
                //jo token login kay time genrate huwa wo lao
                const token = req.header('Authorization').split(" ")[1];
                console.log(token);
                //jesy token verify huwa wo id degea 
                const verifyToken = jwt.verify(token,keysecret)
                console.log(verifyToken);
                //jo id mela us id ko findone query say sara data nekla leya may
                const rootUser = await userdb.findOne({_id:verifyToken._id})
                console.log(rootUser);
                if(!rootUser){
                        throw new Error("user not found")
                }
                req.token = token
                req.rootUser=rootUser
                req.userId = rootUser._id
                next()
               
        }catch(error){
                res.status(401).json({status:401,message:"unautorized error no token provide"})
               
        }
};

export default authenticate;
