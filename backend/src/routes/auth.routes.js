import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// router.get("/test",arcjetProtection,(req,res)=>{
//     res.send("test endpoint");             for testing arcjet only
// })
// arcjet is a rate limiting provider 
router.use(arcjetProtection) // Apply Arcjet protection to all routes in this router anly when this allows only the next api hits
router.post("/signup",signup);

router.post("/login",arcjetProtection,login);

router.post("/logout",logout);
router.put("/update-profile",protectRoute, updateProfile);

router.get("/check",protectRoute,(req,res) =>{
    res.status(200).json(req.user)
});

export default router; 