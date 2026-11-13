import api from "./axios"

export const postApi = {
    getHomeFeed: (currentUserId, page = 0, size = 10) =>
        api.get(`/posts/feed?currentUserId=${currentUserId}&page=${page}&size=${size}`),

    //Create a new post
    createPost: (postData) =>
        api.post(`/posts`, postData),

    //Toggle like/unlike on a post
    toggleLike: (postId, userId) =>
        api.post(`/posts/${postId}/like?userId=${userId}`),

    //Fetch comments for a post
    getComments: (postId) =>
        api.get(`/posts/${postId}/comments`),

    //Add a comment to post
    addComment: (postId, commentData) =>
        api.post(`/posts/${postId}/comments`, commentData),
}