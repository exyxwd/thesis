
import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { UserDataType } from 'models/models';
import { useSetAuthenticated } from './AuthContext';
import { fetchUserinfo, postLogout } from 'API/queryUtils';

// TODO: User name and icon formatting
/**
 * Menu for the dashboard
 *
 * @returns {JSX.Element} THe dashboard menu
 */
const DashboardMenu: React.FC = (): React.ReactElement => {
    const [shouldPost, setShouldPost] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const setIsLoggedIn = useSetAuthenticated();

    useQuery('postLogout', () => postLogout(),
        {
            enabled: shouldPost, onSuccess: (isLogoutSuccesfull) => { isLogoutSuccesfull ? setIsLoggedIn(false) : console.log("Failed logout"); setShouldPost(false); }
        }
    );

    const { error } = useQuery('fetchUserinfo', fetchUserinfo,
        {
            onSuccess: (userData: UserDataType) => { userData ? setUsername(userData.username) : setIsLoggedIn(false); },
            retry: 0
        }
    );

    useEffect(() => {
        if (error) {
            setIsLoggedIn(false);
        }
    } , [error]);

    const handleLogout = () => {
        setShouldPost(true);
    };

    return (
        <>
            <div className="dashboard-menu-area">
                <div className={menuOpen ? "menu-toggle is-active" : "menu-toggle"} onClick={() => setMenuOpen((prevMenuOpen) => !prevMenuOpen)}>
                    <div className="hamburger">
                        <span></span>
                    </div>
                </div>
                <aside className={menuOpen ? "dashboard-sidebar is-active" : "dashboard-sidebar"}>
                    <div className='user-data-container'>
                        <span className="material-symbols-outlined account-icon">account_circle</span>
                        <div className='user-name'>&emsp;{username}</div>
                    </div>
                    <nav className="menu">
                        <Link onClick={() => setMenuOpen(false)} to={'/dashboard'} className={`menu-item ${location.pathname === `/dashboard` ? 'is-active' : ''}`}>
                            <Trans i18nKey="menu.main_page">Főoldal</Trans>
                        </Link>
                        <Link onClick={() => setMenuOpen(false)} to={'/dashboard/register'} className={`menu-item ${location.pathname === `/dashboard/register` ? 'is-active' : ''}`}>
                            <Trans i18nKey="menu.add_user">Felhasználó hozzáadása</Trans>
                        </Link>
                        <Link onClick={() => setMenuOpen(false)} to={'/dashboard/users'} className={`menu-item ${location.pathname === `/dashboard/users` ? 'is-active' : ''}`}>
                            <Trans i18nKey="menu.manage_user">Felhasználók kezelése</Trans>
                        </Link>
                        <Link onClick={() => setMenuOpen(false)} to={'/dashboard/hiddens'} className={`menu-item ${location.pathname === `/dashboard/hiddens` ? 'is-active' : ''}`}>
                            <Trans i18nKey="menu.hidden-locations">Rejtett pontok</Trans>
                        </Link>
                        <Link onClick={() => setMenuOpen(false)} to={'/dashboard/logs'} className={`menu-item ${location.pathname === `/dashboard/logs` ? 'is-active' : ''}`}>
                            <Trans i18nKey="menu.logs">Napló</Trans>
                        </Link>
                    </nav>
                    <div className='logout-area'>
                        <button className="logout-btn btn" onClick={handleLogout}>
                            <span className="material-symbols-outlined">logout</span>
                            <p className='logout-text'><Trans i18nKey="menu.logout">Kijelentkezés</Trans></p>
                        </button>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default DashboardMenu;
