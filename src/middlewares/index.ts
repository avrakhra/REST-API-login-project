import express from 'express';
import { get, merge } from 'lodash';
import { getUserByEmail, getUserBySessionToken } from '../db/users';
import { authentication } from '../helpers';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string; 
        if (!currentUserId) {
            res.sendStatus(403);
            return;
        }
        if (currentUserId.toString() != id) {
            res.sendStatus(403);
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
}
 
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        
        const authHeader = req.headers.authorization; //gets the authorization header
        if (!authHeader) { //checks if header is missing
            res.status(403).json({error : 'Missing or invalid header'});
            return;
        }

        const token = authHeader.split(' ')[1]; //extracts the token string after "Bearer "
        const user = await getUserBySessionToken(token) //looks up user by token
       
        if (!user) { // if there is no user with that token they are unauthorized
        res.status(404).json({error: 'User not found.'});
            return;
        }

        merge(req, { identity: user });
        next();
        return;

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "Unexpected error in isAuthenticated."});
        return;
    }

}