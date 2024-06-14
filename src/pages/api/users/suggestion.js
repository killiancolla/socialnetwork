import mongoose from 'mongoose';
import connectToDatabase from '../../../lib/mongoose';
import Relation from '../../../models/Relation';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const friends = await Relation.find({ followerId: userObjectId }).populate('followingId', '-password');
        const friendIds = friends.map(friend => friend.followingId._id);

        const followers = await Relation.find({ followingId: userObjectId })

        const randomUsers = await User.aggregate([
            { $match: { _id: { $nin: friendIds.concat(userObjectId) } } },
            { $sample: { size: 5 } },
            { $project: { password: 0 } }
        ]);
        res.status(200).json({ friends: friends.map(friend => friend.followingId), followers: followers, randomUsers });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
