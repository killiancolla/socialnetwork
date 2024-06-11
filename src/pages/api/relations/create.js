import connectToDatabase from '../../../lib/mongoose';
import Relation from '../../../models/Relation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { followerId, followingId } = req.body;

    try {
        const relation = new Relation({
            followerId,
            followingId
        });

        await relation.save();
        res.status(201).json(relation);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}
