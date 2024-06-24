import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { query } = req.query;

    await connectToDatabase();

    try {
        const users = await User.find({ username: { $regex: query, $options: 'i' } }).limit(10);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}