export interface Profile {
    id: number;
    name: string;
    age: number;
    location: string;
    occupation: string;
    height: string;
    education: string;
    imageUrl: string;
    isVerified?: boolean;
    religion?: string;
    caste?: string;
    bio?: string;
    family?: string;
    preferences?: string;
    images?: string[];
    is_online?: boolean;
}
