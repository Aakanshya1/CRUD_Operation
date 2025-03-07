import { getUserbyId, getAlluser ,updateUserbyId, deleteUserbyId } from "../models/User.js";

// viewing profile only when token is valid
export const getuser = async (req,res)=>{
    const userId = req.userid;
    console.log(userId)
    try {
        const user = await getUserbyId(userId);
        if(!userId){
            return res.status(400)
            .json({
                message:"User not found",
            })
        }
        res.status(200)
        .json({
            message:"User found",
            name:user.name,
            email:user.email,
            success:true,
        })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",
            success:false,
        })
    }
}

// fetch all users in database
export const getallUser =  async(req,res)=>{
    
    try {
        const user = await getAlluser();
      
        res.status(200)
        .json({
            message:"User fetched Successfully",
            user:user,
          
        })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",
            success:false
        })
    }
}
// updating user 
export const updateUser = async(req,res)=>{
    const userId = req.userid;
    console.log(userId)
    const {name,email}=req.body;
    try {
        const user = await getUserbyId(userId);
        if(!user){
            return res.status(404)
            .json({
                message:"user  not found"
            })
        }

        const updatedUser = await updateUserbyId(userId,name,email);
        if (!updatedUser) {
            return res.status(400).json({
              message: 'Failed to update user',
            });
          }
        res.status(200)
        .json({
            message:"Profile Updated Successfully",
            success:true,
            
           
        })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",error
        })
    }
}


// deleting user by userid
export const deleteUser = async(req,res)=>{
    const userId = req.params.userid;
    try {
        const user = await deleteUserbyId(userId);
        if(!user.affectedRows===0){
            return res.status(404)
            .json({
                message:"User Not Found",
                success:false,
            })
        }
         res.status(200)
            .json({
                message:"User deleted successfully",
                success:true,
            })
    } catch (error) {
        res.status(500)
        .json({
            message:"Internal Server Error",
            success:false
        })
    }
}