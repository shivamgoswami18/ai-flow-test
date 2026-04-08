import i18n from 'i18next';
import { initReactI18next, useTranslation as useI18nTranslation } from 'react-i18next';

import en from './en.json';
import no from './no.json';

const STORAGE_KEY = 'language';
const DEFAULT_LANG = 'no';

const getLanguage = () => {
    if (typeof window === 'undefined') return DEFAULT_LANG;

    const storedLang = sessionStorage.getItem(STORAGE_KEY);
    if (!storedLang) {
        sessionStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
        return DEFAULT_LANG;
    }
    return storedLang;
};

export const changeLanguage = (lang: string) => {
    sessionStorage.setItem(STORAGE_KEY, lang);
    return i18n.changeLanguage(lang);
};

void i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        no: { translation: no },
    },
    lng: getLanguage(),
    fallbackLng: DEFAULT_LANG,
    interpolation: { escapeValue: false },
});

export const useTranslation = () => {
    const { t, i18n } = useI18nTranslation();

    return {
        t,
        changeLanguage,
        language: i18n.language,
    };
};

export default i18n;
