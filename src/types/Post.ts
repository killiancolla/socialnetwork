import { ObjectId } from 'mongoose';

export interface Post {
    _id: ObjectId;
    userId: {
        _id: ObjectId,
        email: string,
        username: string
    };
    text: string;
    images?: string[];
    comments?: ObjectId[];
    createdAt: string;
    updatedAt: string;
    showComments: boolean;
}