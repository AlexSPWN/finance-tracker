export const normalizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
}

export const isValidEmail = (email: string): boolean => {
    const maxLength = 100;
    const normEmail = normalizeEmail(email);
    
    const isInvalidLength = !normEmail || normEmail.length < 3 || normEmail.length > maxLength;
    if(isInvalidLength) return false;
    
    const regExp: RegExp = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return regExp.test(normEmail);
}