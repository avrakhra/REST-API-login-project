import express from 'express';

import { getAllUsers, deleteUser, updateUser } from '../service/users';

import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/me', isAuthenticated, deleteUser);
    router.patch('/users/me', isAuthenticated, updateUser);
};