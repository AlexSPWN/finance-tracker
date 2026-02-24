export const normalizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
}

export const isValidEmail = (email: string): boolean => {
    const maxLength = 100;
    
    const isInvalidLength = !email || email.length < 3 || email.length > maxLength;
    if(isInvalidLength) return false;
    
    const regExp: RegExp = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return regExp.test(email);
}