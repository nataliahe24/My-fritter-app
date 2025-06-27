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

export interface UserResponse {
  firstName: string;
  lastName: string;
  identityDocument: number;
  phoneNumber: string;
  birthDate: string; // LocalDate from Java will be serialized as string
  email: string;
  roleName: string;
}