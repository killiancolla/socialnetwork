import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../lib/mongoose';
import Comment from '../../../models/Comment';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { commentId, flag } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        await connectToDatabase();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.userId._id.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        comment.flag = flag;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
