import i18n from '../../i18n/i18n';

const normalizeFieldName = (fieldName: string, transform?: 'lowercase') => {
    if (!fieldName) {
        return 'value';
    }

    const trimmed = fieldName.trim();
    if (transform === 'lowercase') {
        return trimmed.toLowerCase();
    }
    return trimmed;
};

export const ValidationMessages = {
    required: () => i18n.t('staticValidation.required'),
    format: () => i18n.t('staticValidation.format'),
    email: () => i18n.t('staticValidation.email'),
    numeric: () => i18n.t('staticValidation.numeric'),
    passwordLength: () => i18n.t('staticValidation.passwordLength'),
    passwordsMatch: () => i18n.t('staticValidation.passwordsMatch'),
    passwordsShouldNotMatch: () => i18n.t('staticValidation.passwordsShouldNotMatch'),
    passwordComplexity: () => i18n.t('staticValidation.passwordComplexity'),
    imageSizeValidation: () => i18n.t('staticValidation.imageSize'),
};

export const InputPlaceHolder = (fieldName: string) =>
    i18n.t('staticValidation.placeholder', {
        field: normalizeFieldName(fieldName, 'lowercase'),
        defaultValue: `Enter ${normalizeFieldName(fieldName, 'lowercase')}`,
    });

export const SelectPlaceHolder = (fieldName: string) =>
    i18n.t('staticValidation.selectPlaceHolder', {
        field: normalizeFieldName(fieldName, 'lowercase'),
        defaultValue: `Select ${normalizeFieldName(fieldName, 'lowercase')}`,
    });

export const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}(?![^.\s])/;
export const PasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
export const PhoneRegex = /^\d{8}$/;
export const ZipCodeRegex = /^\d{4}$/;
export const MaxFileSize = 1 * 1024 * 1024;
export const DigitRegex = /^[0-9]*$/;
export const SingleDigitKeyRegex = /^[0-9]$/;
export const PincodeRegex = /^[0-9]{4}$/;
export const OTPRegex = /^\d{6}$/;
export const LocationKeyRegex = /\{\{(.*?)\}\}/g;
export const RouteParamRegex = /:([a-zA-Z]+)/g;
export const SpaceRegex = /\s+/g;
export const imageFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
