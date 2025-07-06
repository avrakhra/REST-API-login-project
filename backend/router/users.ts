import express from 'express';

import { getAllUsers, getPublicUserInfo, deleteUser, updateUser, updateUserAllFields } from '../service/users';

import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
    router.get('/public-users', getPublicUserInfo);
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/me', isAuthenticated, deleteUser);
    router.patch('/users/me', isAuthenticated, updateUser);
    router.patch('/users/update-all', isAuthenticated, updateUserAllFields);
};