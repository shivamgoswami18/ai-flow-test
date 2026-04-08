import { Fragment, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Initialload } from '../contextapi';

const AuthenticationLayout = () => {
    const [pageloading, setpageloading] = useState(false);

    return (
        <Fragment>
            <Initialload.Provider value={{ pageloading, setpageloading }}>
                <Outlet />
            </Initialload.Provider>
        </Fragment>
    );
};

export default AuthenticationLayout;
