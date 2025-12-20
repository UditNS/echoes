import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcrypt'

export async function POST(request: Request){
    await dbConnect();
    try{
        const {username, email, password} = await request.json()
        
        if (!username || !email || !password) {
            return Response.json(
              { success: false, message: "Missing required fields" },
              { status: 400 }
            );
          }
        // checking for existing username
        const existingUserVerifiedbyUserName = await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedbyUserName){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 409})
        }

        // checking for email already registered in the database
        const existingUserbyEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserbyEmail){
            if(existingUserbyEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists"
                }, {status: 500})
            }
            else{ // email exist in db but not verified 
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserbyEmail.password = hashedPassword
                existingUserbyEmail.verifyCode = verifyCode
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserbyEmail.save()
            }
            
        }
        else { // new User
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [] // storing the echoes here
            })

            await newUser.save()
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email, 
            username, 
            verifyCode
        )
        // from docs of resend
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }
        return Response.json({
            success: true,
            message: "User Registered Successfully. Please verify your email "
        }, {status: 201})
    }
    catch(error){
        console.error('Error registering user ' + error)
        return Response.json(
            {
                success: false,
                message: "Failed to register user"
            },
            {
                status: 500
            }
        )
    }
}