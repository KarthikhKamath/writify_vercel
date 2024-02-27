import express from "express"
import User from "../schema/UserSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import getAuth from "../middleware/auth.js"

const UserRouter = express.Router()
UserRouter.use(express.json())

UserRouter.get("/", async (req, res)=>{
    await User.find().then((result)=>{
        res.status(200).json(result)
    }).catch(err=>{
        res.status(400).json({error:err})
    })
})

UserRouter.post("/register",async (req, res)=>{
    try{
        console.log(req.body)
            const {name, email, password} = req.body;
            if(name&&email&&password){
                const hashedPassword = await bcrypt.hash(password, 10)
                const user = await User.create({name, email, password:hashedPassword})
                res.status(200).json({msg:"User reg successfully", user:user})
            }
            else{
                res.status(400).json({msg:"Please fill the reqired fields"})
            }

    }
    catch(err){
        res.status(400).json({error:err})
    }
   
})
UserRouter.post("/login", async (req,res)=>{
    try{
        console.log(req.body)
        const {email, password} = req.body
        const userExists = await User.findOne({email})
        const comparePassword = await bcrypt.compare(password, userExists.password)
        if(!comparePassword){
             res.status(400).json({msg:"Wrong Credentials"})
        }
        const token = jwt.sign({id:userExists._id}, "Karthik")
        res.status(201).json({msg:"User logged in", token:token})
    }
    catch(err){
        console.log(err)
         res.status(400).json({error:err})
    }
})
UserRouter.get("/auth", getAuth, async (req, res) => {
    if (req.authError) {
        res.status(401).json({ error: req.authError });
    } else {
        if (req.auth) {
            res.status(200).json(req.auth);
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    }
});


export default UserRouter