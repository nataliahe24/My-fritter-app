export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    identityDocument: number;
    phoneNumber: string;
    birthDate: Date;
    email: string;
    password: string;
}


export interface createUserDto {
    firstName: string;
    lastName: string;
    identityDocument: number;
    phoneNumber: string;
    birthDate: Date;
    email: string;
    password: string;
    role: string;
}