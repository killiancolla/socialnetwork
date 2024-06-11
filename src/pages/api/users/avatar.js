import multer from 'multer';
import nextConnect from 'next-connect';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

const upload = multer({
    storage: multer.diskStorage({
        destination: '/public/avatars',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    })
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Something went wrong: ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' not allowed` });
    }
});

apiRoute.use(upload.single('avatar'));

apiRoute.post(async (req, res) => {
    await connectToDatabase();

    const { userId } = req.body;

    try {
        const avatarPath = `/avatars/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarPath },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false,
    },
};
