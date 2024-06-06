import { ObjectId } from 'mongoose';
import { Comment } from './Comment';

export interface Post {
    _id: ObjectId;
    userId: {
        _id: ObjectId;
        email: string;
        username: string;
    };
    text: string;
    images?: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
    showComments: boolean;
    textComment: string;
}