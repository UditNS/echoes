import {resend} from '../lib/resend'
import VerificationEmail from '../../emails/VerficationEmail'
import { apiResponse } from '@/types/apiResponse'

export async function sendVerficationEmail(
    email: string,
    username: string,
    verificationCode: string,
): Promise<apiResponse>{
    try{
        await resend.emails.send({ // from the resend docs boilerplate code need to write this
            from: "uditn007@gmail.com",
            to: email,
            subject: 'Echoes Verification Code',
            react: VerificationEmail({username, otp: verificationCode})
        })
        return {
            success: true,
            message: "Verification code send successfully"
        }
    }
    catch(error){
        console.error("Error in sending the email " + error)
        return {
            success: false,
            message: "Failed in sending the email"
        }
    }
}