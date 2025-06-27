import express from 'express';
import { authentication, random } from '../helpers';
import { deleteUserById, getUserById, getUserBySessionToken, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader.split(' ')[1];
        const user = await getUserBySessionToken(token);
        
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const deletedUser = await deleteUserById(user.id);

        if (!deletedUser) {
            res.status(404).json({ error: 'Failed to delete user or already deleted.' });
            return;
        }

        res.status(200).json(deletedUser).end();

    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'Unexpected error.'});
        return;
    }
}

export const updateUser = async (req: express.Request, res:express.Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(403).json({error: 'Missing or invalid auth header'});
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const user = await getUserBySessionToken(token);
        
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const { username, email, password } = req.body;
        
        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            const newSalt = random();
            const newHash = authentication(newSalt, password);
            user.authentication.salt = newSalt;
            user.authentication.password = newHash;
        }
        await user.save();

        res.status(200).json(user).end();

    } catch (error) {

        console.log(error);
        res.status(400).json("Unexpected error.");
        return;
    }
}