import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId, username, email, name, surname, avatarUrl, flag, password } = req.body;

    await connectToDatabase();

    try {
        let updatedUser;

        if (password && password !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { username, email, name, surname, avatar: avatarUrl, flag, password: hashedPassword },
                { new: true }
            );
        } else {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { username, email, name, surname, avatar: avatarUrl, flag },
                { new: true }
            );
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
}
