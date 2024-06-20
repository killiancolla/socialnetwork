import mongoose from 'mongoose';
import Comment from './Comment';
import Post from './Post';
import Relation from './Relation';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: false },
    surname: { type: String, required: false },
    avatar: { type: String, required: false, default: 'https://firebasestorage.googleapis.com/v0/b/socialnetwork-cf028.appspot.com/o/avatars%2Fvecteezy_default-avatar-profile-icon-vector-in-flat-style_27708418.jpg?alt=media&token=eb69a849-4c2f-4363-bef8-6900a654a047' },
    flag: { type: Boolean, required: true, default: true }
}, { timestamps: true });

UserSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.flag === false) {
        const userId = this.getQuery()._id;

        await Post.updateMany({ userId: userId }, { flag: false });
        await Comment.updateMany({ userId: userId }, { flag: false });
        await Relation.deleteMany({ $or: { 'followerId': userId, 'followingId': userId } })
    }
    next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;