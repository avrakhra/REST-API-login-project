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

        const token = authHeader.split(' ')[1]; // extracts the token string after "Bearer "
        const user = await getUserBySessionToken(token).select('+authentication.tokenCreatedAt') //looks up user by token
        
         if (!user) { // if there is no user with that token they are unauthorized
            res.status(404).json({error: 'User not found.'});
            return;
        }
        
        const tokenCreatedAt = new Date(user.authentication.tokenCreatedAt).getTime(); // convert to timestamp
        const timeNow = Date.now();
        const tokenAge = timeNow - tokenCreatedAt; // token age in milliseconds
        const maxAge = 30 * 60 * 1000; // maximum milliseconds a token can be valid (30 minutes)

        if (tokenAge > maxAge) {
            res.status(401).json({ error: 'Session expired. Please log in again. '});
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