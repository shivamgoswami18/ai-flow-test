import { norwegianPhoneCode } from '../Constants/CommonConstants';

export const norwegianPhonePrefix = () => {
    return (
        <>
            <i className="ri-add-fill" />
            {norwegianPhoneCode}
        </>
    );
};
