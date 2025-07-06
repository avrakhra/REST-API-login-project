import mongoose from 'mongoose';

const UserAuthSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true }, 
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true }, 
    zip: { type: String, required: true }, 
    authentication: {
        password: { type: String, required: true, select: false }, 
        salt : {type: String, select: false }, 
        sessionToken: {type: String, select: false },
        tokenCreatedAt: { type: Date, select: false},
    },
}, { collection: 'users', versionKey: false });

export const UserAuthModel = mongoose.model('UserAuth', UserAuthSchema);

const UserPublicSchema = new mongoose.Schema({
    email: { type: String, required: true }, 
    zip: { type: String, required: true }, 
}, { collection: 'users', versionKey: false });

export const UserPublicModel = mongoose.model('UserPublic', UserPublicSchema);