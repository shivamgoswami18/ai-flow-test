export interface User {
    id: string;
    name: string;
    email: string;
    lastLogin: string;
    isActive: boolean;
    role: string;
    phone?: string;
}
