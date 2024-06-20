import mongoose from 'mongoose';
import connectToDatabase from '../../../lib/mongoose';
import Post from '../../../models/Post';

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, postId } = req.body;

    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid userId or postId' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userIdObject = new mongoose.Types.ObjectId(userId);
        if (post.likes.includes(userIdObject)) {
            await Post.findByIdAndUpdate(
                post._id,
                { $pull: { likes: userIdObject } },
                { new: true }
            );
        } else {
            post.likes.push(userIdObject);
            await post.save()
        }

        const populatedPost_ = await Post.findById(post._id)
            .populate({
                path: 'comments',
                match: { flag: true },
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'userId',
                    match: { flag: true },
                    select: 'username email avatar'
                }
            })
            .populate('userId', 'username email avatar');

        var populatedPost = {}
        if (populatedPost_) {
            const filteredComments = populatedPost_.comments.filter(comment => comment && comment.userId);
            populatedPost = { ...populatedPost_.toObject(), comments: filteredComments };
        }

        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
