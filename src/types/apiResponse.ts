import { Message } from "@/models/User";

export interface apiResponse {
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean, // this is optional because we will not send this when user just signup
    messages?: Array<Message>
}