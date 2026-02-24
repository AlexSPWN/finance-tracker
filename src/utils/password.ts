export const StrengthList = ["bad", "low", "good", "high"] as const;
type Strength = typeof StrengthList[number];
export const RuleList = ["minLength", "hasLower", "hasUpper", "hasNumber", "hasSpecial"] as const;
type Rules = Record<typeof RuleList[number], boolean>;

export type PwdStrength = {
    isValid: boolean;
    strength: Strength;
    rules: Rules;
    points: number;
}
export const checkPassword = (pwd: string): PwdStrength => {
    const minLength = 8;
    const pwdLen =  pwd.length;
    let pwdPoints = pwdLen > 15 ? 3 
            : pwd.length > 11 ? 2 
            : pwdLen > 7 ? 1
            : 0;
    
    const pwdContains = (regExp: RegExp, value: string, point: number) => {
        const res = value.match(regExp)
        if(!res) return false
        pwdPoints += point;
        return true;        
    }
    
    const rules: Rules = {
        minLength: pwd.length >= minLength,
        hasLower: pwdContains(/[a-z]/g, pwd, 1),
        hasUpper: pwdContains(/[A-Z]/g, pwd, 1),
        hasNumber: pwdContains(/[0-9]/g, pwd, 1),
        hasSpecial: pwdContains(/[!@#$%^&*(),.?":{}|<>_\s]/g, pwd, 1)
    }
    const isValid = Object.values(rules).filter(Boolean).length === 5;

    /* const strength = isValid ? pwdPoints > 25 ? StrengthList[3] 
        : pwdPoints > 15 ? StrengthList[2] 
        : pwdPoints > 9 ? StrengthList[1] 
        : StrengthList[0] : StrengthList[0]; */
    
    const strength = isValid ? pwdPoints > 6 ? StrengthList[3] 
        : pwdPoints > 5 ? StrengthList[2] 
        : pwdPoints > 4 ? StrengthList[1] 
        : StrengthList[0] : StrengthList[0];

    return {isValid, strength, rules, points: pwdPoints}
}