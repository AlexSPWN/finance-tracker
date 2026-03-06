import { Route, Routes } from "react-router";
import { HomePage } from "../pages/HomePage";
import { LogInPage } from "../pages/LogInPage";
import { SignUpPage } from "../pages/SignUpPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../pages/Dashboard/DashboardLayout";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { ProfilePage } from "../pages/Dashboard/ProfilePage";
import { RoleProtectedRoute } from "./RoleProtectedRoute";
import { AdminPage } from "../pages/Dashboard/admin/AdminPage";
import { ManagerPage } from "../pages/Dashboard/manager/ManagerPage";

export const AppRouter = () => {

    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="admin" element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                        <AdminPage />
                    </RoleProtectedRoute>
                }/>                
                <Route path="manager" element={
                    <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
                        <ManagerPage />
                    </RoleProtectedRoute>
                }/>
            </Route>
            <Route path="*" element={<NotFoundPage />}/>
        </Routes>
    );
}