import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost/todolist_api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = (userData) => API.post('register.php', userData);
export const loginUser = (credentials) => API.post('login.php', credentials);
export const getTasks = (userId) => API.get(`tasks.php?user_id=${userId}`);
export const addTask = (taskData) => API.post('tasks.php', taskData);
export const createTask = (taskData) => API.post('tasks.php', taskData); 
export const updateTask = (taskData) => API.put('tasks.php', taskData);
export const deleteTask = (taskId) => API.delete(`tasks.php?id=${taskId}`);