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
        const encodedString = authHeader.split(' ')[1]; // this gets the part of the header after the word "Basic"
        const decodedString = Buffer.from(encodedString, 'base64').toString('utf-8'); // this decodes the base64 string into email:password format
        const [email, password] = decodedString.split(':'); // splits the string into email andd password
        
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password'); // find the user by email including the password and salt fields
        if (!user) {
        res.status(400).json({error: 'User not found.'});
            return;
        }
        
        const expectedHash = authentication(user.authentication.salt, password); // hashing given password
        if (user.authentication.password != expectedHash) {
            res.status(403).json({error: 'Invalid password.'});
            return;
        }

        merge(req, { identity: user });

        next();

        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(400).json({ error: "Unexpected error in isAuthenticated."});
        return;
    }
}