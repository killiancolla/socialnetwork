import connectToDatabase from '../../../lib/mongoose';
import Relation from '../../../models/Relation';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await connectToDatabase();

    const { userId, followId } = req.body;

    try {
        const relation = await Relation.findOne({
            followerId: userId,
            followingId: followId
        });

        if (!relation) {
            return res.status(404).json({ message: 'Relation not found' });
        }

        await Relation.findByIdAndDelete(relation._id);

        return res.status(200).json({ message: 'Relation deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}
