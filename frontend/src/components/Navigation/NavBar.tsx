import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { i18n as i18nType } from 'i18next';

import LanguageSelector from './LanguageSelector';
import petLogo from 'images/PET_logo_white.png';

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

    function handleNavigationButton() {
        setShowNavigation(prevState => !prevState)
    }

    return (
        <>
            {/* <ul id='navbar-nav'>
                    <li className='nav-item' key={1}>
                        <Link to={`${baseURL}`} className='nav-link'>
                            <Trans i18nKey='menus.map'>Térkép</Trans>
                        </Link>
                    </li>
                    <li className='nav-item' key={2}>
                        <Link to={`${baseURL}/contact`} className='nav-link'>
                            <Trans i18nKey='menus.contact'>Kapcsolat</Trans>
                        </Link>
                    </li>
                    <li className='nav-item' key={3}>
                        <Link to={`${baseURL}/about`} className='nav-link'>
                            <Trans i18nKey='menus.about_us'>Rólunk</Trans>
                        </Link>
                    </li>
                </ul>
                <LanguageSelector i18n={i18n} />
            </nav>
            <nav className='navbar small-Navbar'> */}
            <nav>
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


            {/* <nav id='navbar' className='navbar-expand fullsize-Navbar'> */}
            {/* <a id='navbar-brand' href={baseURL}><img src={petLogo} alt='PETkupa logo' className='main-logo'></img></a> */}
            {/* <ul id='navbar-nav'>
                    <li className='nav-item' key={1}>
                        <Link to={`${baseURL}`} className='nav-link'>
                            <Trans i18nKey='menus.map'>Térkép</Trans>
                        </Link>
                    </li>
                    <li className='nav-item' key={2}>
                        <Link to={`${baseURL}/contact`} className='nav-link'>
                            <Trans i18nKey='menus.contact'>Kapcsolat</Trans>
                        </Link>
                    </li>
                    <li className='nav-item' key={3}>
                        <Link to={`${baseURL}/about`} className='nav-link'>
                            <Trans i18nKey='menus.about_us'>Rólunk</Trans>
                        </Link>
                    </li>
                </ul>
                <LanguageSelector i18n={i18n} />
            </nav>
            <nav className='navbar small-Navbar'> */}
            {/* <a className='navbar-brand' href={baseURL}><img src={petLogo} alt='PETkupa logo' className='main-logo'></img></a> */}
            {/* <button className='btn nav-item navbar-list-button' onClick={() => handleNavigationButton()}>
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
            <div className={showNavigation ? 'navigation-menu active' : 'navigation-menu'}>
                <ul>
                    <li>
                        <Link to={`${baseURL}`} className='nav-link' onClick={() => handleNavigationButton()}>
                            <Trans i18nKey='menus.map'>Térkép</Trans>
                        </Link>
                    </li>
                    <li>
                        <Link to={`${baseURL}/contact`} className='nav-link' onClick={() => handleNavigationButton()}>
                            <Trans i18nKey='menus.contact'>Kapcsolat</Trans>
                        </Link>
                    </li>
                    <li>
                        <Link to={`${baseURL}/about`} className='nav-link' onClick={() => handleNavigationButton()}>
                            <Trans i18nKey='menus.about_us'>Rólunk</Trans>
                        </Link>
                    </li>
                    <li>
                        <LanguageSelector i18n={i18n} />
                    </li>
                </ul>
            </div> */}

        </>
    )
}

export default NavBar;