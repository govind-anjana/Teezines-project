import User from "../model/UserModel.js";


export const UseUser=async(req,res)=>{
    try{
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({message:"User not found"});
    
        if(!user.hasUsedAI){
          user.hasUsedAI = true; //  mark AI use
          await user.save();
        }
    
        res.json({success:true, message:"AI used successfully"});
      }catch(err){
        res.status(500).json({error:err.message});
      }
}
export const UserAll=async(req,res)=>{
    try{
        const aiUsers = await User.find({hasUsedAI:true}, "username email");
        res.json({success:true, totalUsers: aiUsers.length, users: aiUsers});
      }catch(err){
        res.status(500).json({error:err.message});
      }
}