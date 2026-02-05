import { demoStore } from '../data/demoStore';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'STAFF';
    department?: string;
    createdAt: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'STAFF';
    department?: string;
}

export const getUsers = async (): Promise<User[]> => {
    return demoStore.getUsers();
};

export const createUser = async (data: CreateUserDto): Promise<User> => {
    const newUser: User = {
        id: `u-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        createdAt: new Date().toISOString()
    };
    return demoStore.addUser({ ...newUser, status: 'Active' });
};

export const updateUser = async (id: string, data: Partial<CreateUserDto>): Promise<User> => {
    const allUsers = await demoStore.getUsers();
    const updated = allUsers.find((user) => user.id === id) || ({} as User);
    return { ...updated, ...data } as User;
};

export const deleteUser = async (id: string): Promise<void> => {
    await demoStore.deleteUser(id);
};
