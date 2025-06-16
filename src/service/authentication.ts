
import express from 'express';
import { getUserByEmail, getUserByUsername, createUser } from '../db/users';
import { random, authentication, } from '../helpers';
export const login = async (req: express.Request, res:express.Response) => {
    try {
        const authHeader = req.headers.authorization; //written as "Authorization: Basic base64(email:password)"
        const encodedString = authHeader.split(' ')[1]; // this gets the part of the header after the word "Basic"
        const decodedString = Buffer.from(encodedString, 'base64').toString('utf-8'); // this decodes the base64 string into email:password format
        const [email, password] = decodedString.split(':'); // splits the string into email andd password

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password'); //Find the user by email including the password and salt fields
        if (!user) {
            res.status(400).json({error: 'User not found.'});
            return;
        }

        const expectedHash = authentication(user.authentication.salt, password); // hashing given password
        if (user.authentication.password != expectedHash) {
            res.status(403).json({error: 'Invalid password.'});
            return;
        }

        const salt = random(); // if login successful make a new session token and store it 
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.status(200).json(user).end();
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }

}

export const register = async (req: express.Request, res: express.Response) => {
    try { 
        const { email, password, username }  = req.body;
        if (!email || !password || !username) {
            res.sendStatus(400);
            return;
        }

        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            res.status(409).json({error: "Email already exists."});
            return;
        }

        const existingUsername = await getUserByUsername(username);
        if (existingUsername) {
            res.status(409).json({error: "Username already taken."});
            return;
        }

        const specialChar = password.includes('!') || password.includes('@') || password.includes('#') || password.includes('$') || password.includes('%') || password.includes('&');
        if (password.length < 8 || !specialChar) {
            res.status(400).json({ error: "Passsword must be at least 8 characters and contain a speical character."});
            return;
        }

        const salt = random();
        const user = await createUser({
            email, 
            username, 
            authentication: {
                salt, 
                password: authentication(salt, password),
            },
        });
        res.status(200).json(user).end();
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }

}