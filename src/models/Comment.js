import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    flag: { type: Boolean, default: true, required: true }
}, { timestamps: true });


const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment;