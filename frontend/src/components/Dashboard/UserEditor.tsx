import { useQuery } from 'react-query';
import React, { useState } from 'react';

import { UserDataType } from 'models/models';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { fetchUsers, postPasswordChange, postUsernameChange, deleteUser } from 'API/queryUtils';
import { Trans } from 'react-i18next';

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
    const [userData, setUserData] = useState<UserDataType[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedOperation, setSelectedOperation] = useState<Operation>();
    const [shouldPostPassChange, setShouldPostPassChange] = useState<boolean>(false);
    const [shouldPostNameChange, setShouldPostNameChange] = useState<boolean>(false);
    const [shouldPostDelete, setShouldPostDelete] = useState<boolean>(false);
    const [shouldFetchUsers, setShouldFetchUsers] = useState<boolean>(true);

    const handleShow = (username: string, operation: Operation) => {
        setInputValue('');
        setShowModal(true);
        setSelectedUser(username);
        setSelectedOperation(operation);
    }
    const handleClose = () => {
        setShowModal(false);
    }

    const { isLoading } = useQuery('getUsers', fetchUsers,
        {
            enabled: shouldFetchUsers, onSuccess: (data: UserDataType[]) => {
                setUserData(data); setShouldFetchUsers(false);
            }
        });

    useQuery('postPasswordChange', () => postPasswordChange(selectedUser, inputValue),
        {
            enabled: shouldPostPassChange, onSuccess: (isPasswordChangeSuccesful) => {
                isPasswordChangeSuccesful ? console.log("Password change succesful") : console.log("Password change failed");
                setShouldPostPassChange(false); setShouldFetchUsers(true);
            }
        });

    useQuery('postUsernameChange', () => postUsernameChange(selectedUser, inputValue),
        {
            enabled: shouldPostNameChange, onSuccess: (isUserNameChangeSuccesful) => {
                isUserNameChangeSuccesful ? console.log("Username change succesful") : console.log("Username change failed");
                setShouldPostNameChange(false); setShouldFetchUsers(true);
            }
        });

    useQuery('deleteUser', () => deleteUser(selectedUser),
        {
            enabled: shouldPostDelete, onSuccess: (isDeleteSuccesful) => {
                isDeleteSuccesful ? console.log("Delete succesful") : console.log("Delete failed");
                setShouldPostDelete(false); setShouldFetchUsers(true);
            }
        });

    if (isLoading) {
        return <div className='loader'></div>;
    }

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

    return (
        <div className="user-table-container">
            <table className="table user-table table-striped">
                <thead>
                    <tr className='user-table-head'>
                        <th onClick={() => setUserData([...userData].sort((a, b) => { return a.username.localeCompare(b.username) }))}>
                            <Trans i18nKey="username">Felhasználónév</Trans>
                        </th>
                        {/* <th onClick={() => setUserData([...userData].sort((a, b) => { return a.role.localeCompare(b.role) }))}>
                            <Trans i18nKey="authority">Hatáskör</Trans>
                        </th> */}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user) => {
                        return (
                            <tr key={user.username} className='user-table-row'>
                                <td>{user.username}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                            <span className="material-symbols-outlined">edit</span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleShow(user.username, Operation.ChangePassword)}><Trans i18nKey="change_password">Jelszó megváltoztatása</Trans></Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleShow(user.username, Operation.Rename)}><Trans i18nKey="change_username">Felhasználónév megváltoztatása</Trans></Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleShow(user.username, Operation.Delete)}><Trans i18nKey="delete_user">Felhasználó törlése</Trans></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Modal show={showModal} onHide={handleClose}>
                {selectedOperation == Operation.ChangePassword &&
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title><Trans i18nKey="change_password_of">A felhasználó jelszavának megváltoztatása</Trans>&nbsp;({selectedUser})</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control type="text" placeholder={`Új jelszó...`} value={inputValue} onChange={handleInputChange} />
                        </Modal.Body>
                    </>
                }
                {selectedOperation == Operation.Rename &&
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title><Trans i18nKey="change_username_of">A felhasználó felhasználónevének megváltoztatása</Trans>&nbsp;({selectedUser})</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control type="text" placeholder={`Új felhasználónév...`} value={inputValue} onChange={handleInputChange} />
                        </Modal.Body>
                    </>
                }
                {selectedOperation == Operation.Delete &&
                    <Modal.Header closeButton>
                        <Modal.Title><Trans i18nKey="confirm_delete">Biztosan törölni akarja a felhasználót?</Trans>&nbsp;({selectedUser})</Modal.Title>
                    </Modal.Header>
                }
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <Trans i18nKey="exit">Kilépés</Trans>
                    </Button>
                    {selectedOperation == Operation.ChangePassword || selectedOperation == Operation.Rename ?
                        <Button variant="primary" onClick={handleSaveChanges}>
                            <Trans i18nKey="save">Mentés</Trans>
                        </Button>
                        :
                        <Button variant="danger" onClick={handleSaveChanges}>
                            <Trans i18nKey="delete">Törlés</Trans>
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserEditor;