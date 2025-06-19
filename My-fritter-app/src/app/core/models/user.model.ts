export interface createUserDto {
    id?: number;
    firstName: string;
    lastName: string;
    identityDocument: number;
    phoneNumber: string;
    birthDate: Date;
    email: string;
    password: string;
}