import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import dbConnect from "@/lib/dbConnect";
import UserModel  from "@/models/User";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try{
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error ('Please check your credentials again.')
                    }
                    if(user.isVerified){
                        throw new Error ('Please verify your account first. To verify your account do signup')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect) return user// where this user is returning?
                    // this user is returning to the providers at the line 8
                    else{
                        throw new Error ("Please check your credentials again.")
                    }
                }
                catch(error: any){
                    throw new Error(error)
                }
            },
            credentials: {
                username: { label: "Email", type: "text "},
                password: { label: "Password", type: "password" },
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
                
            }
            return session
            // if I am customizing the session then I must have to return the session
        },
        async jwt({ token, user }) { //this user comes form the providers
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token // if I am customizing the jwt then I must have to return the token
        }
    },
    pages: {
        signIn: '/signIn'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}