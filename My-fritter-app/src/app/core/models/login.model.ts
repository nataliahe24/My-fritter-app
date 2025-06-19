export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    name: string;
    email: string;
    message: string;
    role: string;
}
