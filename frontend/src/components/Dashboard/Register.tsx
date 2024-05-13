import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import React, { FormEvent, useEffect, useState } from 'react';

import { RegisterData } from 'models/models';
import { postRegisterData } from 'API/queryUtils';

/**
 * Register interface for admins
 * 
 * @returns {React.ReactElement} The register interface for admins
 */
const Register: React.FC = (): React.ReactElement => {
    const [failedRegistry, setFailedRegistry] = useState<boolean>(false);
    const [successfulRegistry, setSuccessfulRegistry] = useState<boolean>(false);
    const [shouldPost, setShouldPost] = useState<boolean>(false);
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        password: '',
    });

    useEffect(() => {
        if (registerData.username || registerData.password) {
            setSuccessfulRegistry(false);
        }
        setFailedRegistry(false);
    }, [registerData.username, registerData.password]);

    useQuery('postRegisterData', () => postRegisterData(registerData),
        {
            enabled: shouldPost, onSuccess: (isRegistrySuccessful) => {
                isRegistrySuccessful ? (setFailedRegistry(false), setSuccessfulRegistry(true),
                    setRegisterData({
                        username: '',
                        password: '',
                    })) :
                    (setFailedRegistry(true), setSuccessfulRegistry(false)); setShouldPost(false)
            },
            onError: () => { setFailedRegistry(true); setShouldPost(false); setSuccessfulRegistry(false); },
            retry: 0
        }
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({
            ...registerData,
            [event.target.id]: event.target.value,
        });
    };

    const handleRegister = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setShouldPost(true);
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center register-area">
                <div className="col-md-7">
                    <h1 className="text-center"><Trans i18nKey="user.register_user">Új felhasználó regisztrálása</Trans></h1>
                    <br />
                    <br />
                    <form autoComplete="off" onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label"><Trans i18nKey="user.username">Felhasználónév</Trans></label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={registerData.username}
                                onChange={handleInputChange}
                                maxLength={25}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label"><Trans i18nKey="user.password">Jelszó</Trans></label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={registerData.password}
                                onChange={handleInputChange}
                                maxLength={25}
                                required
                            />
                        </div>
                        {failedRegistry && <p className='invalid-creds-text'><Trans i18nKey="user.registry_fail">Sikertelen regisztráció.</Trans></p>}
                        {successfulRegistry && <p className='valid-creds-text'><Trans i18nKey="user.registry_success">Sikeres regisztráció.</Trans></p>}
                        <br />
                        <div className="d-grid gap-2">
                            <button type="submit" className={failedRegistry ? "btn btn-primary invalid-creds-btn" : "btn btn-primary"}>
                                <Trans i18nKey="user.register">Regisztrálás</Trans>
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}

export default Register;
