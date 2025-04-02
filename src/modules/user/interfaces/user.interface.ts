export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user';
    isEmailVerified:boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
    emailVerificationToken: String
}