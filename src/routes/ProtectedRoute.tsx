import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { commonConstants } from '../components/Constants/CommonConstants';
import { localizedPath } from '../i18n/localizedRoutes';

type ProtectedRouteProps = {
    isAllowed?: boolean;
    redirectPath?: string;
    children: ReactNode;
};

const ProtectedRoute = ({
    isAllowed,
    redirectPath = localizedPath('SignIn'),
    children,
}: ProtectedRouteProps) => {
    const authToken = sessionStorage.getItem(commonConstants.authToken);
    const isAuthenticated = !!authToken;

    const allowed = isAllowed !== undefined ? isAllowed : isAuthenticated;

    if (!allowed) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
