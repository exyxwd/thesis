import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import React, { useState, useEffect, FormEvent } from 'react';

import { useLocation, useNavigate } from 'react-router';
import { postLoginData, fetchUserinfo } from 'API/queryUtils';
import { useAuthenticated, useSetAuthenticated } from './AuthContext';

/**
 * Login interface
 *
 * @returns {React.ReactElement} The login interface
 */
const Login: React.FC = (): React.ReactElement => {
    const setAuthenticated = useSetAuthenticated();
    const authenticated = useAuthenticated();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [invalidCreds, setInvalidCreds] = useState<boolean>(false);
    const [shouldPost, setShouldPost] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    useQuery('getUserinfo', fetchUserinfo,
        {
            enabled: !authenticated, onSuccess: (isAuthenticated) => { if (isAuthenticated) { setAuthenticated(true) } },
            retry: 0
        });

    useQuery('postLoginData', () => postLoginData(username, password),
        {
            enabled: shouldPost, onSuccess: (isLoginSuccesfull) => { isLoginSuccesfull ? onSuccessfulLogin() : setInvalidCreds(true); setShouldPost(false); }
        });

    useEffect(() => {
        if (authenticated && location.state?.from) {
            navigate(location.state.from);
        }
        else if (authenticated) {
            navigate('/dashboard');
        }
    }, [authenticated])

    const onSuccessfulLogin = () => {
        setAuthenticated(true);
        setInvalidCreds(false);

        if (location.state?.from) {
            navigate(location.state.from);
        }
        else {
            navigate('/dashboard');
        }
    }

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setShouldPost(true);
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center"><Trans i18nKey="user.login">Bejelentkezés</Trans></h1>
                    <form autoComplete="off" onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label"><Trans i18nKey="user.username">Felhasználónév</Trans></label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label"><Trans i18nKey="user.password">Jelszó</Trans></label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            <p className='invalid-creds-text'>{invalidCreds ? <Trans i18nKey="user.wrong_creds">Hibás jelszó vagy felhasználónév.</Trans> : <></>}</p>
                        </div>
                        <br/>
                        <div className="d-grid gap-2">
                            <button type="submit" className={invalidCreds ? "btn btn-primary invalid-creds-btn" : "btn btn-primary"}>
                                <Trans i18nKey="user.login">Bejelentkezés</Trans>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
