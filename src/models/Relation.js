import mongoose from 'mongoose';

const RelationSchema = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Relation = mongoose.models.Relation || mongoose.model('Relation', RelationSchema);

export default Relation;