import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Pour les likes des commentaires
}, { timestamps: true });


const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment;