import express from 'express';
import { authentication, formatPhoneNumber, random } from '../helpers';
import { deleteUserById, getUserByEmail, getUserById, getUserBySessionToken, getUserByUsername, getUsers } from '../db/users';

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

export const getPublicUserInfo = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        const publicInfo = users.map(user => ({ 
            email: user.email,
            zip: user.zip,
        }));
        res.status(200).json(publicInfo);
        return;
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to fetch public user info.' });
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

        res.status(200).json({ message: 'Successfully deleted user. '}) ;

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
            res.status(403).json({error: 'Missing or invalid auth header.'});
            return;
        }
        
        const token = authHeader.split(' ')[1];
        const user = await getUserBySessionToken(token);
        
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }

        const { username, email, password, phoneNumber, address, city, zip } = req.body;
        if (username) {
            if (username != user.username) {
                const existingUser = await getUserByUsername(username);
                if (existingUser) {
                    res.status(409).json({ error: 'Username already taken.'});
                    return;
                }
            }
            user.username = username;
        }

        if (email) {
            if (email != user.email) {
                const existingUser = await getUserByEmail(email);
                if (existingUser) {
                    res.status(409).json({ error: 'Email already in use.'});
                    return;
                }
            }
            user.email = email;
        }

        if (password) {
            const newSalt = random();
            const newHash = authentication(newSalt, password);
            user.authentication.salt = newSalt;
            user.authentication.password = newHash;
        }

        if (phoneNumber) {
            user.phoneNumber = formatPhoneNumber(phoneNumber);
        }

        if (address) {
            user.address = address;
        }

        if (city) {
            user.city = city;
        }

        if (zip) {
            user.zip = zip;
        }

        await user.save();

        res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        res.status(400).json("Unexpected error.");
        return;
    }
}

export const updateUserAllFields = async (req: express.Request, res:express.Response) => {
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

        const { username, email, password, phoneNumber, address, city, zip } = req.body;

        if (!email || !password || !username || !phoneNumber || !address || !city || !zip) {
            res.status(400).json({ error: 'All fields required. Please provide email, password, username, address, city, zip, and phone number.'});
            return;
        }

        if (username != user.username) {
            const existingUser = await getUserByUsername(username);
            if (existingUser) {
                res.status(409).json({ error: 'Username already taken.'});
                return;
            }
        }

        if (email != user.email) {
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                res.status(409).json({ error: 'Email already in use.'});
                return;
            }
        }

        user.username = username;
        user.email = email;
        user.phoneNumber = formatPhoneNumber(phoneNumber);
        user.address = address;
        user.city = city;
        user.zip = zip;

        const newSalt = random();
        const newHash = authentication(newSalt, password);
        user.authentication.salt = newSalt;
        user.authentication.password = newHash;
        
        await user.save();

        res.status(200).json({ message: 'User fully updated.', user });

    } catch (error) {
        console.log(error);
        res.status(400).json('Unexpected error.');
        return;
    }
}