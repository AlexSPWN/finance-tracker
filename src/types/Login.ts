export type LoginForm = {
    email: string;
    password: string;
}

export type ErrorFields = Partial<Record<keyof LoginForm, string>>
export type TouchedFields = Partial<Record<keyof LoginForm, boolean>>