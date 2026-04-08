import type { ReactNode } from 'react';
import { localizedPath } from '../i18n/localizedRoutes';
import AuthenticationLayout from '../services/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import App from '../App';
import { Navigate } from 'react-router-dom';
import UsersPage from '../pages/settings/UsersPage';
import CategoriesPage from '../pages/settings/CategoriesPage';

export interface RouteConfig {
    path?: string;
    element?: ReactNode;
    isPublic?: boolean;
    index?: boolean;
    children?: RouteConfig[];
}

const basePath = import.meta.env.BASE_URL;

export const redirectPath = localizedPath('SignIn');

export const publicRoutes: RouteConfig[] = [
    {
        path: basePath,
        element: <AuthenticationLayout />,
        isPublic: true,
        children: [
            {
                path: localizedPath('SignIn'),
                element: <div>Signin</div>,
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
                path: localizedPath('settingsCategories'),
                element: <CategoriesPage />,
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
