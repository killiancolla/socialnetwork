import connectToDatabase from '../../../lib/mongoose';
import Comment from '../../../models/Comment';
import Post from '../../../models/Post';
import Relation from '../../../models/Relation';
import User from '../../../models/User';

export default async function handler(req, res) {
    console.log(User, Comment);
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { userId } = req.query;

    try {

        const friends = await Relation.find({ followerId: userId })
        const followingIds = friends.map(follow => follow.followingId);
        const allIds = [userId, ...followingIds]

        const posts = await Post.find({ userId: { $in: allIds }, flag: true })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'userId',
                    select: 'username email avatar'
                }
            })
            .populate('userId', 'username email avatar');

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
