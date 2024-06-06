import connectToDatabase from '../../../lib/mongoose';
import Comment from '../../../models/Comment';
import Post from '../../../models/Post';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { userId, postId, text, likes } = req.body;

    try {
        const comment = new Comment({
            userId,
            postId,
            text,
            likes
        });

        const savedComment = await comment.save();
        await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: savedComment._id } },
            { new: true }
        );

        const populatedComment = await savedComment.populate('userId', 'username email');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
