import api from './axios';

export const userApi = {
    register: (userData) =>
        api.post('/users/register', userData),

    getProfile: (username) =>
        api.get(`/users/${username}`),

    toggleFollow: (targetUserId, currentUserId) =>
        api.post(`/users/${targetUserId}/follow?currentUserId=${currentUserId}`),
}