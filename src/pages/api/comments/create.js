import connectToDatabase from '../../../lib/mongoose';
import Comment from '../../../models/Comment';
import Post from '../../../models/Post';
import authenticate from '../../middleware/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    authenticate(req, res, async () => {
        const { userId, postId, text } = req.body;

        try {
            const comment = new Comment({
                userId,
                postId,
                text,
            });

            await comment.save();

            await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    });
}