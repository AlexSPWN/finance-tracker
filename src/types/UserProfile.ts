export const RoleList = ["user", "manager", "admin"] as const;
export type Role = typeof RoleList[number];
export type UserProfile = {
    email: string | null;
    role: Role;
    createdAt: Date;
}