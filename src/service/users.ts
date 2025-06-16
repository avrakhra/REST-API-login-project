import express from 'express';

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
        const {id} = req.params;
        const {username} = req.body;
        if (!username) {
            res.sendStatus(400);
            return;
        }
        const user = await getUserById(id);
        user.username = username;
        await user.save();
        res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
}