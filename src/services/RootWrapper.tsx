import type { ReactNode } from 'react';

type RootWrapperProps = {
    children: ReactNode;
};

function RootWrapper({ children }: RootWrapperProps) {
    return <>{children}</>;
}

export default RootWrapper;
