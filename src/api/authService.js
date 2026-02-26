import axiosInstance from './axiosConfig'

const login = async (credentials) => {
    const response = await axiosInstance.post('accounts/login/', credentials);
    return response.data;
}

const userInfo = async () => {
    const response = await axiosInstance.get('accounts/me/');
    return response.data;
}

const logout = async () => {
    const response = await axiosInstance.get('accounts/logout/');
    return response.data;
}

const checkAuth = async () => {
    const response = await axiosInstance.get('accounts/is-authenticate/');
    return response.data;
}
export default {
    login,
    userInfo,
    logout,
    checkAuth
}