import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, username, email, name, surname, avatarUrl, flag } = req.body;

    await connectToDatabase();

    try {
        const updateuseer = await User.findByIdAndUpdate(
            userId,
            { username: username, email: email, name: name, surname: surname, avatar: avatarUrl, flag: flag },
            { new: true }
        );
        res.status(200).json(updateuseer);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
