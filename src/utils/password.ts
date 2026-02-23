export const StrengthList = ["bad", "low", "good", "high"] as const;
type Strength = typeof StrengthList[number];
export const RuleList = ["minLength", "hasLower", "hasUpper", "hasNumber", "hasSpecial"] as const;
type Rules = Record<typeof RuleList[number], boolean>;

type PwdStrength = {
    isValid: boolean;
    strength: Strength;
    rules: Rules;
    points: number;
}
export const checkPassword = (pwd: string): PwdStrength => {
    const minLength = 5;

    let pwdPoints = 0;
    
    const pwdContains = (regExp: RegExp, value: string, point: number) => {
        const res = value.match(regExp)
        if(!res) return false
        pwdPoints += res.length * point;
        console.log(res);
        return true;        
    }
    
    const rules: Rules = {
        minLength: pwd.length >= minLength, //20
        hasLower: pwdContains(/[a-z]/g, pwd, 1), // /[a-z]/.test(pwd)
        hasUpper: pwdContains(/[A-Z]/g, pwd, 1), // /[A-Z]/.test(pwd),
        hasNumber: pwdContains(/[0-9]/g, pwd, 2), // /[0-9]/.test(pwd),
        hasSpecial: pwdContains(/[!@#$%^&*(),.?":{}|<>_]/g, pwd, 3) // /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    }

    const strength = pwdPoints > 25 ? StrengthList[3] : pwdPoints > 15 ? StrengthList[2] : pwdPoints > 11 ? StrengthList[1] : StrengthList[0];

    const isValid = Object.values(rules).filter(Boolean).length === 5;

    return {isValid, strength, rules, points: pwdPoints}
}