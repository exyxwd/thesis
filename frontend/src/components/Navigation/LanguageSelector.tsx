import React from 'react';
import { Dropdown } from 'react-bootstrap';
import 'flag-icons/css/flag-icons.min.css';

import { languages } from 'i18n/i18n';
import { i18n as i18nType } from 'i18next';


interface NavigationProps {
    i18n: i18nType;
}

/**
 * Sets up the language selector
 *
 * @param {NavigationProps} param0 The i18n object
 * @returns {React.ReactElement} Language selector
 */
const LanguageSelector: React.FC<NavigationProps> = ({
    i18n,
}: NavigationProps): React.ReactElement => {
    return (
        <Dropdown className='language-selector'>
            <Dropdown.Toggle variant='secondary' className='language-dropdown'>
                <span className={`fi fi-${languages[i18n.resolvedLanguage || 'hu'].flag}`}></span>
            </Dropdown.Toggle>
            <Dropdown.Menu className='language-dropdown-menu'>
                {Object.keys(languages).map((lng) => (
                    <Dropdown.Item key={lng} onClick={() => i18n.changeLanguage(lng)}>
                        <div className='flag-container'>
                            {languages[lng].nativeName}
                            <span className={`fi fi-${languages[lng].flag}`}></span>
                        </div>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default LanguageSelector;