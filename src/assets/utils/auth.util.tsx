import { STORAGEKEY } from "./app.config";
import localStore from "./localstore.util";

export const getUserInfo = () => localStore.get_data(STORAGEKEY.userData);

export const setUserInfo = (data: any) => localStore.store_data(STORAGEKEY.userData, data);

export const getUserLogin = () => localStore.get_data(STORAGEKEY.islogin);
export const getUserID = () => localStore.get_data(STORAGEKEY.islogin)?.user?.id;
export const getUserRole = () => localStore.get_data(STORAGEKEY.islogin)?.userInfo?.role;
export const getAgentId = () => localStore.get_data(STORAGEKEY.islogin)?.teleCMI?.agentId;
export const getUserToken = () => localStore.get_data(STORAGEKEY.islogin)?.access_token;

export const userLogin = (data: any) => localStore.store_data(STORAGEKEY.islogin, data);

export const logout = () => {
    localStore.remove_data(STORAGEKEY.islogin);
    return true;
};

export const isLoggedIn = () => {
    const islogin = getUserLogin();
    return islogin ? true : false;
};
