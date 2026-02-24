export type RegisterForm = {
    email: string;
    password: string;
    repassword: string;
}

export type ErrorFields = Partial<Record<keyof RegisterForm, string>>
export type TouchedFields = Partial<Record<keyof RegisterForm, boolean>>