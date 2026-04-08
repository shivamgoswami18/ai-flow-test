import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { privateRoutes, publicRoutes, redirectPath } from './routesConfig';
import type { RouteConfig } from './routesConfig';
import { commonConstants } from '../components/Constants/CommonConstants';
import type { ReactNode } from 'react';
import { fillParams, localizedPath } from '../i18n/localizedRoutes';

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const authToken = sessionStorage.getItem(commonConstants.authToken);
    const isAuthenticated = !!authToken;

    if (isAuthenticated) {
        return <Navigate to={fillParams(localizedPath('dashboard'))} replace />;
    }

    return <>{children}</>;
};

const renderRoutes = (routes: RouteConfig[], isProtected = false) => {
    return routes?.map(({ path, element, children }) => (
        <Route
            key={path}
            path={path}
            element={
                isProtected ? (
                    <ProtectedRoute>{element}</ProtectedRoute>
                ) : (
                    <PublicRoute>{element}</PublicRoute>
                )
            }
        >
            {children && renderRoutes(children, isProtected)}
        </Route>
    ));
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route index element={<Navigate to={redirectPath} replace />} />
            {renderRoutes(publicRoutes, false)}
            {renderRoutes(privateRoutes, true)}
            <Route path="*" element={<Navigate to={redirectPath} replace />} />
        </Routes>
    );
};

export default AppRoutes;
