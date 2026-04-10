import type { ReactNode } from 'react';
import { localizedPath } from '../i18n/localizedRoutes';
import AuthenticationLayout from '../services/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import App from '../App';
import { Navigate } from 'react-router-dom';
import UsersPage from '../pages/settings/UsersPage';
import RolesPage from '../pages/settings/RolesPage';
import CategoriesPage from '../pages/settings/CategoriesPage';
import StatusesPage from '../pages/settings/StatusesPage';
import OrganizationOnboarding from '../pages/Authentication/Organization';

export interface RouteConfig {
    path?: string;
    element?: ReactNode;
    isPublic?: boolean;
    index?: boolean;
    children?: RouteConfig[];
}

const basePath = import.meta.env.BASE_URL;

export const redirectPath = localizedPath('signIn');

export const publicRoutes: RouteConfig[] = [
    {
        path: basePath,
        element: <AuthenticationLayout />,
        isPublic: true,
        children: [
            {
                path: localizedPath('signIn'),
                element: <div>Signin</div>,
            },
            {
                path: localizedPath('organization'),
                element: <OrganizationOnboarding />,
            },
        ],
    },
    {
        path: basePath,
        element: <DashboardLayout />,
        isPublic: true,
        children: [
            {
                path: localizedPath('dashboard'),
                element: <DashboardPage />,
            },
            {
                path: localizedPath('settings'),
                element: <Navigate to={localizedPath('settingsUsers')} replace />,
            },
            {
                path: localizedPath('settingsUsers'),
                element: <UsersPage />,
            },
            {
                path: localizedPath('settingsRoles'),
                element: <RolesPage />,
            },
            {
                path: localizedPath('settingsCategories'),
                element: <CategoriesPage />,
            },
            {
                path: localizedPath('settingsStatuses'),
                element: <StatusesPage />,
            },
        ],
    },
];

export const privateRoutes: RouteConfig[] = [
    {
        path: basePath,
        element: <App />,
        children: [
            {
                path: localizedPath('dashboard'),
                element: <DashboardPage />,
            },
        ],
    },
];
