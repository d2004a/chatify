import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js"

export const sendWelcomeEmail = async (email,name,clientURL)=>{
    const {data,error} = await resendClient.emails.send({
        from : `${sender.name} <${sender.email}>`,
        to : email,
        subject : "Welcome To Chik-Chat!",
        html : createWelcomeEmailTemplate(name,clientURL)
    })
    if(error){
        console.error("Error Sending Welcome Email:",error);
        throw new Error("failed to send welcome email")
    }
    console.log("welcome email send successfully",data); 
}