import React, { useState } from 'react';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { deleteUser, FetchError, fetchUsers, postPasswordChange, postUsernameChange } from 'API/queryUtils';
import { useShowNotification } from 'components/Main/NotificationContext';
import { NotificationType, UserDataType } from 'models/models';
import Pagination from './Pagination';

/**
 * Enumeration for the different user editing operations
 *
 * @enum {number}
 * @readonly
 * @property {number} Delete - Delete user
 * @property {number} Rename - Rename user
 * @property {number} ChangePassword - Change user password
 */
enum Operation {
    Delete,
    Rename,
    ChangePassword,
}

/**
 * Component for editing user's properties
 *
 * @returns {React.ReactElement} - User editor interface
 */
const UserEditor = (): React.ReactElement => {
    const showNotification = useShowNotification();
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserDataType[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedOperation, setSelectedOperation] = useState<Operation>();
    const [shouldFetchUsers, setShouldFetchUsers] = useState<boolean>(true);
    const [shouldPostDelete, setShouldPostDelete] = useState<boolean>(false);
    const [shouldPostPassChange, setShouldPostPassChange] = useState<boolean>(false);
    const [shouldPostNameChange, setShouldPostNameChange] = useState<boolean>(false);
    const { t } = useTranslation();

    const recordsPerPage = 14;
    const [indexOfLastRecord, setIndexOfLastRecord] = useState<number>(recordsPerPage);
    const [indexOfFirstRecord, setIndexOfFirstRecord] = useState<number>(0);
    const currentRecords = userData.slice(indexOfFirstRecord, indexOfLastRecord);

    // Function to show the modal with the selected operation
    const handleShow = (username: string, operation: Operation) => {
        setInputValue('');
        setShowModal(true);
        setSelectedUser(username);
        setSelectedOperation(operation);
    }
    const handleClose = () => {
        setShowModal(false);
    }

    const { error, isLoading } = useQuery('getUsers', fetchUsers,
        {
            enabled: shouldFetchUsers, onSuccess: (data: UserDataType[]) => {
                // Sort users by username
                setUserData([...data].sort((a, b) => { return a.username.localeCompare(b.username) }));
                setShouldFetchUsers(false);
            },
            onError: () => {
                setShouldFetchUsers(false);
                showNotification(NotificationType.Error, 'fetch_users_error');
            }
        });

    useQuery('postPasswordChange', () => postPasswordChange(selectedUser, inputValue),
        {
            enabled: shouldPostPassChange, onSuccess: () => {
                setShouldPostPassChange(false);
                setShouldFetchUsers(true);
                showNotification(NotificationType.Success, 'change_password_success');
            },
            onError: (error: FetchError) => {
                if (error.status === 400) showNotification(NotificationType.Error, 'change_password_error_too_short');
                else showNotification(NotificationType.Error, 'change_password_error');
                setShouldPostPassChange(false);
            },
            retry: 0
        });

    useQuery('postUsernameChange', () => postUsernameChange(selectedUser, inputValue),
        {
            enabled: shouldPostNameChange, onSuccess: () => {
                setShouldPostNameChange(false);
                setShouldFetchUsers(true);
                showNotification(NotificationType.Success, 'change_username_success');
            },
            onError: (error: FetchError) => {
                if (error.status === 409) showNotification(NotificationType.Error, 'change_username_error_taken');
                else if (error.status === 422) showNotification(NotificationType.Error, 'change_username_error_non_alphanumeric');
                else if (error.status === 400) showNotification(NotificationType.Error, 'change_username_error_too_short');
                else showNotification(NotificationType.Error, 'change_username_error');
                setShouldPostNameChange(false);
            },
            retry: 0
        });

    useQuery('deleteUser', () => deleteUser(selectedUser),
        {
            enabled: shouldPostDelete, onSuccess: () => {
                setShouldPostDelete(false);
                showNotification(NotificationType.Success, 'delete_user_success');
                setShouldFetchUsers(true);
            },
            onError: (error: FetchError) => {
                if (error.status === 409) showNotification(NotificationType.Error, 'delete_user_error_self');
                else showNotification(NotificationType.Error, 'delete_user_error');
                setShouldPostDelete(false);
            },
            retry: 0
        });

    const handlePageChange = (indexOfFirstRecord: number, indexOfLastRecord: number) => {
        setIndexOfLastRecord(indexOfLastRecord);
        setIndexOfFirstRecord(indexOfFirstRecord);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSaveChanges = () => {
        if (selectedOperation == Operation.ChangePassword) {
            setShouldPostPassChange(true);
        }
        else if (selectedOperation == Operation.Rename) {
            setShouldPostNameChange(true);
        }
        else {
            setShouldPostDelete(true);
        }
        handleClose();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    if (isLoading) {
        return <div className='admin-loader'></div>;
    }

    if (error) {
        return <div></div>;
    }

    return (
        <div className="user-table-container">
            <table className="table user-table table-striped">
                <thead>
                    <tr className='user-table-head sticky-top'>
                        <th>
                            <Trans i18nKey="user_editor.username">Felhasználónév</Trans>
                            <span onClick={() => setUserData(prevUserData => prevUserData.slice().reverse())}
                                className="material-symbols-outlined sort-icon">
                                swap_vert
                            </span>
                        </th>
                        <th>
                            <Trans i18nKey="user_editor.edit">Módosítás</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((user) => {
                        return (
                            <tr key={user.username} className='user-table-row'>
                                <td >{user.username.length > 25 ? `${user.username.substring(0, 25)}...` : user.username}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            <span className="material-symbols-outlined">edit</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleShow(user.username, Operation.ChangePassword)}>
                                                <Trans i18nKey="user_editor.change_password">Jelszó megváltoztatása</Trans>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleShow(user.username, Operation.Rename)}>
                                                <Trans i18nKey="user_editor.change_username">Felhasználónév megváltoztatása</Trans>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleShow(user.username, Operation.Delete)}>
                                                <Trans i18nKey="user_editor.delete_user">Felhasználó törlése</Trans>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {Math.ceil(userData.length / recordsPerPage) > 1 && (
                <Pagination
                    totalRecords={userData.length}
                    recordsPerPage={recordsPerPage}
                    handlePageChange={handlePageChange}
                />
            )}
            <Modal show={showModal} onHide={handleClose}>
                {selectedOperation == Operation.ChangePassword &&
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                <Trans i18nKey="user_editor.change_password_of">A felhasználó jelszavának megváltoztatása</Trans>
                                <br />({selectedUser})
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <div className="position-relative">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        maxLength={25}
                                        placeholder={t('user_editor.new_password')}
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        id="password"
                                        required
                                    />
                                    <span className='material-symbols-outlined show-password-icon' onClick={togglePasswordVisibility}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                }
                {selectedOperation == Operation.Rename &&
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title >
                                <Trans i18nKey="user_editor.change_username_of">A felhasználó felhasználónevének megváltoztatása</Trans>
                                <br />({selectedUser})
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control type="text" maxLength={25} placeholder={t('user_editor.new_username')} value={inputValue} onChange={handleInputChange} />
                        </Modal.Body>
                    </>
                }
                {selectedOperation == Operation.Delete &&
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <Trans i18nKey="user_editor.confirm_delete">Biztosan törölni akarja a felhasználót?</Trans>
                            <br />({selectedUser})
                        </Modal.Title>
                    </Modal.Header>
                }
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <Trans i18nKey="user_editor.exit">Kilépés</Trans>
                    </Button>
                    {selectedOperation == Operation.ChangePassword || selectedOperation == Operation.Rename ?
                        <Button variant="primary" onClick={handleSaveChanges}>
                            <Trans i18nKey="user_editor.save">Mentés</Trans>
                        </Button>
                        :
                        <Button variant="danger" onClick={handleSaveChanges}>
                            <Trans i18nKey="user_editor.delete">Törlés</Trans>
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserEditor;