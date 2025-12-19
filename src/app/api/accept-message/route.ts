import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from 'next-auth'
// this route will toggle user should accept message or not

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions) // It retrieves the current user’s authentication session on the server. 
    const user: User = session?.user as User // why as User -> assert (without it, it is giving error)
    if(!session || !session.user){
        return Response.json (
            {
            success : false,
            message : 'Not authenticated'
            },
            {
                status: 401
            }
        )
    }
    const userId = user._id
    const {acceptMessage} = await request.json()

    try{
        const updatedUser =  await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessage})
        if(!updatedUser){
            return Response.json (
                {
                success : false,
                message : 'Something went wrong while updating user'
                },
                {
                    status: 401
                }
            )
        }
        return Response.json (
            {
            success : true,
            message : 'Message acceptance status updated successfully',
            updatedUser
            },
            {
                status: 200
            }
        )

    }
    catch(error){
        console.log("Something went wrong while toggling the message  : " + error)
        return Response.json (
            {
            success : false,
            message : 'Something went wrong while toggling the message'
            },
            {
                status: 500
            }
        )
    }
}

export async function GET(request: Request){
    await dbConnect()

    try{
        const session = await getServerSession(authOptions) 
        const user: User = session?.user as User 
        if(!session || !session.user){
            return Response.json (
                {
                success : false,
                message : 'Not authenticated'
                },
                {
                    status: 401
                }
            )
        }
        const userId = user._id

        const foundUser = await UserModel.findById(userId)

        if(!foundUser){
            return Response.json (
                {
                success : false,
                message : 'User not found'
                },
                {
                    status: 404
                }
            )
        }

        return Response.json (
            {
            success : true,
            message : 'Not authenticated',
            isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {
                status: 200
            }
        )
    }
    catch(error){
        console.log("Something went wrong while toggling the message  : " + error)
        return Response.json (
            {
            success : false,
            message : 'Something went wrong while toggling the message'
            },
            {
                status: 500
            }
        )
    }
}