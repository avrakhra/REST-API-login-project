import express from 'express';
import { authentication, random } from '../helpers';

import { deleteUserById, getUserById, getUsers } from '../db/users';

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
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
         if (!deletedUser) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(deletedUser).end();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
}

export const updateUser = async (req: express.Request, res:express.Response) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
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