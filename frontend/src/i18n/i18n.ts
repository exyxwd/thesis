import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import hu from './hu.json';
import en from './en.json';

interface NativeNames {
    [key: string]: {
        nativeName: string;
        flag: string;
    };
}

export const languages: NativeNames = {
    hu: { nativeName: 'Magyar', flag: 'hu' },
    en: { nativeName: 'English', flag: 'gb' }
};

const resources = {
    hu: {
        name: 'Magyar',
        translation: hu,
    },
    en: {
        name: 'English',
        translation: en,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        resources,
        fallbackLng: 'hu',
        supportedLngs: ['hu', 'en'],
        interpolation: {
            escapeValue: false
        },
        missingKeyHandler: () => { },
    });

export default i18n;