import { useSelector } from 'react-redux'

const useUserPermission = () => {
  return useSelector((state) => state.userPermission.userPermission);
}

const useUserPermissionLoading = () => {
  return useSelector((state) => state.userPermission.is_loading);
}

const useUserPermissionError = () => {
  return useSelector((state) => state.userPermission.error);
}

export default { useUserPermission, useUserPermissionLoading, useUserPermissionError };