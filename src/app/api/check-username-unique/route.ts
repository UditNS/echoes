import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import {z} from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect()

    try{
        const { searchParams } = new URL(request.url) // this gives the full url
        const queryParam = {
            username : searchParams.get('username') // i am fetching the username from the url.
        }
        // validating the username
        const result = UsernameQuerySchema.safeParse(queryParam)// queryParam need to be an object
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters" 
                }, {status: 400}
            )
        }
        
        const {username} = result.data

        const exisitingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if(exisitingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username already taken" 
                }, {status: 400}
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            }, {status: 200 }
        )
    }
    catch(error){
        console.log("Something went wrong while checking the username : " + error)
        return Response.json (
            {
            success : false,
            message : 'Something went wrong while checking the username'
            },
            {
                status: 500
            }
        )
    }
}