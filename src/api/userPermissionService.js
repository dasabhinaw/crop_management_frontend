import axiosInstance from './axiosConfig'

const userPermissionService = async () => {
    const response = await axiosInstance.get('accounts/user/permission/');
    return response.data;
}

export default {
    userPermissionService,
}