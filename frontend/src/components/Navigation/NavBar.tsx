import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { i18n as i18nType } from 'i18next';

import LanguageSelector from './LanguageSelector';
import petLogo from 'images/logos/PET_logo_white.png';

interface NavigationProps {
    i18n: i18nType;
}

/**
 * Sets up the navigation bar
 * 
 * @param {NavigationProps} param0 The i18n object
 * @returns {React.ReactElement} Navigation bar
 */
const NavBar: React.FC<NavigationProps> = ({ i18n }: NavigationProps): React.ReactElement => {
    const [showNavigation, setShowNavigation] = useState(false)
    const baseURL = window.location.origin;
    const navRef = useRef<HTMLElement>(null);

    function handleNavigationButton() {
        setShowNavigation(prevState => !prevState)
    }

    useEffect(() => {
        document.addEventListener("click", handleClickElsewhere, true);
        return () => {
            document.removeEventListener("click", handleClickElsewhere);
        }
    }, []);

    const handleClickElsewhere = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (navRef.current && !navRef.current.contains(target)) {
            setShowNavigation(false);
        }
    }

    return (
        <nav id='nav-bar' ref={navRef}>
            <Link to={`${baseURL}`}>
                <img src={petLogo} alt='PETkupa logo' className='main-logo'></img>
            </Link>

            <ul className={showNavigation ? "expanded-nav" : ""}>
                <li>
                    <Link to={`${baseURL}`}>
                        <Trans i18nKey='menus.map'>Térkép</Trans>
                    </Link>
                </li>
                <li>
                    <Link to={`${baseURL}/contact`}>
                        <Trans i18nKey='menus.contact'>Kapcsolat</Trans>
                    </Link>
                </li>
                <li>
                    <Link to={`${baseURL}/about`}>
                        <Trans i18nKey='menus.about_us'>Rólunk</Trans>
                    </Link>
                </li>
                <li>
                    <LanguageSelector i18n={i18n} />
                </li>
            </ul>
            <button id='nav-expand-btn' onClick={handleNavigationButton}>
                {showNavigation ?
                    <span className='material-symbols-outlined'>
                        expand_less
                    </span>
                    :
                    <span className='material-symbols-outlined'>
                        expand_more
                    </span>}
            </button>
        </nav>
    )
}

export default NavBar;