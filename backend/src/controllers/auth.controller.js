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
    } catch (error) {
        
    }
}