import { UserAuthModel, UserPublicModel } from '../db/userModels';

export const getPublicUsers = () => UserPublicModel.find();
export const getUserByEmail = (email:string) => UserAuthModel.findOne({email});
export const getUserByUsername = (username:string) => UserAuthModel.findOne({username});
export const getUserBySessionToken = (sessionToken: string) => UserAuthModel.findOne({
    'authentication.sessionToken': sessionToken,});
export const getUserById = (id: string) => UserAuthModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserAuthModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserAuthModel.findOneAndDelete({_id: id});
export const updateUserById = (id: string, values: Record<string, any>) => UserAuthModel.findByIdAndUpdate(id, values);
