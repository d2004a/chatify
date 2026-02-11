import { generateToken } from "../lib/utils.js";
import User from "../model/User.js";
import bcrypt from "bcryptjs"

export const signup = async(req,res)=>{
    const {fullName, email, password} = req.body

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All Fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "password must be at least of 6 characters"});
        }
        // check if email is vaild or not : through regex
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailregex.test(email)){
            return res.status(400).json({message: "invalid email format"})
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "email already exists"})
        }
        // hasing the password using bcrypt
        const salt = await bcrypt.genSalt(10) // tells what willbe the length of the hashed password
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            
            // generateToken(newUser._id,res)
            // await newUser.save()

            const savedUser = await newUser.save();
            generateToken(savedUser._id,res);

            res.status(201).json({
                _id: newUser._id,
                fullName : newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            res.status(400).json({message: "Invaid User Data"})
        }
    } catch (error) {
        console.log("Error in signup controller:",error)
        res.status(500).json({message: "Internal server error"})
    }
}