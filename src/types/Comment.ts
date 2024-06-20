import { ObjectId } from "mongoose";

export interface Comment {
    _id: ObjectId;
    userId: {
        _id: ObjectId;
        username: string;
        avatar: string;
    };
    text: string;
    likes: {
        _id: ObjectId;
        username: string;
    }[];
    createdAt: string;
    updatedAt: string;
    flag: boolean;
}