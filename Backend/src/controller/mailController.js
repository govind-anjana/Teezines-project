//  import dotenv from 'dotenv';
//  dotenv.config();

//  const accountSid=process.env.TWILIO_ACCOUNT_SID;
//  const authTokin=process.env.TWILIO_AUTH_TOKEN;

//  const client=new twilio(accountSid,authTokin)
//  export const SendOtp=async(req,res)=>{
//    const {to,message}=req.body;
//   try {

//     const result=await client.messages.create({
//       body:message,
//       from:process.env.EMAIL_FROM,
//       to:to
//     })


//   } catch (error) {
    
//   }
//  }