
import express from 'express';
import { getUserByEmail, getUserByUsername, createUser } from '../db/users';
import { random, authentication, formatPhoneNumber, } from '../helpers';
export const login = async (req: express.Request, res:express.Response) => {
    try {
        const authHeader = req.headers.authorization; // written as "Authorization: Basic base64(email:password)"
        
        if (!authHeader) {
            res.status(401).json({error: 'Authorization header missing.'});
            return;
        }

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
        const sessionToken = authentication(salt, user._id.toString()); //generate session token (Bearer)
        user.authentication.sessionToken = sessionToken; // save token
        user.authentication.tokenCreatedAt = new Date(); // save current time as token creation time
 
        await user.save(); // save updated user

        const localTimeString = new Date(user.authentication.tokenCreatedAt).toLocaleString('en-US', { timeZone: 'America/Chicago', });
        res.status(200).json({ token: user.authentication.sessionToken , message: 'Token created at ' + localTimeString + '. It will expire in 30 minutes.' });
        return;

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }

}

export const register = async (req: express.Request, res: express.Response) => {
    try { 
        const { email, password, username, phoneNumber, address, city, zip }  = req.body;
        if (!email || !password || !username || !phoneNumber || !address || !city || !zip) {
            res.status(400).json({ error: 'Missing required fields. Please provide email, password, username, address, city, zip, and phone number.'});
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
            res.status(400).json({ error: "Passsword must be at least 8 characters and contain a special character."});
            return;
        }
        const salt = random();
        const user = await createUser({
            email, 
            username,
            phoneNumber: formatPhoneNumber(phoneNumber),
            address,
            city, 
            zip,
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