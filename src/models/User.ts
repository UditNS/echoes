import mongoose, {Schema, Document} from "mongoose"

// defining a TypeScript interface called Message that extends (inherits from) Document.
export interface Message extends Document {
    content: string,
    createdAt: Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type: Date,
        required : true,
        default : Date.now
    }
})

// User Schema
export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[] // storing the echoes here
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true, "Username is required"],
        trim: true,
        unique: true,
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        trim: true,
        unique: true,
    },
    password : {
        type : String,
        required : [true, "Password is required"]
    },
    verifyCode : {
        type : String,
        required : [true, "Verification code is required"]
    },
    verifyCodeExpiry : {
        type: Date,
        required : [true, "Verification code expiry is required"]
    },
    isVerified : {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage :{
        type: Boolean,
        default: true,
    },
    messages : [MessageSchema] // referring to the messageSchema
})

// Next.js runs on the edge. So, it doesn't know whether it presents or not
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))
// 1st condition is for that the model is already present

export default UserModel;