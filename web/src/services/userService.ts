import api from './api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN';
    department?: string;
    createdAt: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN';
    department?: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
};

export const updateUser = async (id: string, data: Partial<CreateUserDto>): Promise<User> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
};
