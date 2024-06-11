import { ObjectId } from "mongoose";

export interface User {
    _id: ObjectId;
    email: string;
    username: string;
    name: string;
    surname: string;
    avatar: string;
}