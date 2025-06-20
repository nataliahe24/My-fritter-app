export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    name: string;
    email: string;
    message: string;
    role: Role;
}
export interface Role {
    id: number;
    name: string;
    description: string;
  }