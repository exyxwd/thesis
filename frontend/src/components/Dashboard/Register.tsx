import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import React, { FormEvent, useEffect, useState } from 'react';

import { RegisterData } from 'models/models';
import { FetchError, postRegisterData } from 'API/queryUtils';

/**
 * Register interface for admins
 * 
 * @returns {React.ReactElement} The register interface for admins
 */
const Register: React.FC = (): React.ReactElement => {
    const [registryError, setRegistryError] = useState<string>('');
    const [successfulRegistry, setSuccessfulRegistry] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [shouldPost, setShouldPost] = useState<boolean>(false);
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        password: '',
    });

    // Reset error messages when the user starts typing
    useEffect(() => {
        if (registerData.username || registerData.password) {
            setSuccessfulRegistry(false);
        }
        setRegistryError('');
    }, [registerData.username, registerData.password]);

    useQuery('postRegisterData', () => postRegisterData(registerData),
        {
            enabled: shouldPost, onSuccess: (isRegistrySuccessful) => {
                if (isRegistrySuccessful) {
                    setRegistryError('registry_fail');
                    setSuccessfulRegistry(true);
                    setRegisterData({ username: '', password: '' });
                }
                else {
                    setRegistryError('true');
                    setSuccessfulRegistry(false);
                }
                setShouldPost(false)
            },
            onError: (error: FetchError) => {
                if (error.status === 409) setRegistryError('taken_username');
                else setRegistryError('registry_fail');
                setShouldPost(false);
                setSuccessfulRegistry(false);
            },
            retry: 0
        }
    );

    /**
     * Handles the input change, sets the register data
     *
     * @param event The input change event
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData(prevRegisterData => ({
            ...prevRegisterData,
            [event.target.id]: event.target.value,
        }));
    };

    /**
     * Handles the register form submission, checks the data and sets the error message if needed
     *
     * @param evt The form event
     */
    const handleRegister = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const alphanumericRegex = /^[a-zA-Z0-9 ÁáÉéÍíÓóÖöŐőÚúÜüŰű]+$/i;
        if (!alphanumericRegex.test(registerData.username) || registerData.username.trim() === '') {
            setRegistryError('non_alphanumeric_username');
        } else if (registerData.username.trim().length < 4 || registerData.password.trim().length < 4) {
            setRegistryError('too_short_creds');
        } else {
            setRegistryError('');
            setShouldPost(true);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
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
                            <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    value={registerData.password}
                                    onChange={handleInputChange}
                                    maxLength={25}
                                    required
                                />
                                <span className='material-symbols-outlined show-password-icon' onClick={togglePasswordVisibility}>
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </div>
                        </div>
                        {registryError && <p className='invalid-creds-text'><Trans i18nKey={`user.${registryError}`}>Hiba történt a felhasználó regisztrálása során.</Trans></p>}
                        {successfulRegistry && <p className='valid-creds-text'><Trans i18nKey="user.registry_success">Sikeres regisztráció.</Trans></p>}
                        <br />
                        <div className="d-grid gap-2">
                            <button type="submit" className={registryError ? "btn btn-primary invalid-creds-btn" : "btn btn-primary"}>
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
