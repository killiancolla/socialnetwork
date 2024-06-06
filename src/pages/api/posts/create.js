import connectToDatabase from '../../../lib/mongoose';
import Post from '../../../models/Post';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { userId, text, images } = req.body;

    try {
        const post = new Post({
            userId,
            text,
            images,
        });

        await post.save();
        const populatedPost = await Post.findById(post._id).populate('userId', '_id email username');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
