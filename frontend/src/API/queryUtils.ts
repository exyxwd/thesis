import { ExpandedTrashData, MinimalTrashData, RegisterData, UserDataType } from 'models/models';
// const baseURL = window.location.origin;
// const baseURL = 'http://localhost:8080/api';

/**
 * Fetches detailed data of a waste dump
 *
 * @param {number} id - id of the waste dump
 * @returns {ExpandedTrashData} - detailed data of the waste dump
 */
export const fetchWasteById = async (id: number): Promise<ExpandedTrashData> => {
    const response = await fetch(`/api/wastes/${id}`, { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return await response.json();
}

/**
 * Fetches detailed data of waste dumps from multiple given ids
 *
 * @param {number[]} ids - ids of the waste dumps
 * @returns {SidebarTrashData} - detailed data of the waste dumps
 */
export const fetchMultipleWasteById = async (ids: number[]): Promise<ExpandedTrashData[]> => {
    const requestData = {
        ids: ids
    };
    const response = await fetch('/api/wastes/filteredWastes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    return response.json();
};

/**
 * Fetches reduced data of waste dumps fitting the default filters
 *
 * @returns {MinimalTrashData[]} - reduced data of default filter fitting waste dumps
 */
export const fetchFilteredWasteData = async (): Promise<MinimalTrashData[]> => {
    const response = await fetch('/api/wastes/mapDataFiltered', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
};

/**
 * Fetches reduced data of waste dumps not fitting the default filters
 *
 * @returns {MinimalTrashData[]} - reduced data of default filter fitting waste dumps
 */
export const fetchFilteredInverseWasteData = async (): Promise<MinimalTrashData[]> => {
    const response = await fetch('/api/wastes/mapDataFilteredInverse', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
};

/**
 * Fetches user info from the server
 *
 * @returns {UserDataType} - the user's username
 */
export const fetchUserinfo = async (): Promise<UserDataType> => {
    const response = await fetch('/api/auth/userInfo', { method: 'GET' });
    console.log(response);
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    return response.json();
};

/**
 * Posts login request data to the server
 *
 * @param {string} username - username of the user
 * @param {string} password - password of the user
 */
export const postLoginData = async (username: string, password: string): Promise<boolean> => {
    const loginData = {
        username: username,
        password: password
    };
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });

    if (!response.ok) {
        return false;
    }

    return true;
};

/**
 * Posts logout request to the server
 */
export const postLogout = async (): Promise<boolean> => {
    const response = await fetch('/api/auth/logout', {
        method: 'POST'
    });

    if (!response.ok) {
        return false;
    }

    return true;
};

/**
 * Posts admin initiated register request data to the server
 * @param {RegisterData} data - the data of the new user needed for registration
 */
export const postRegisterData = async (data: RegisterData): Promise<boolean> => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        return false;
    }

    return true;
};

/**
 * Fetches existing users
 * 
 * @returns {UserDataType[]} - names of all existing users
 */
export const fetchUsers = async (): Promise<UserDataType[]> => {
    const response = await fetch('/api/auth/users', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    console.log()
    return response.json();
};

/**
 * Posts password change request data to the server
 * @param {string} username - username of the user
 * @param {string} newPassword - new password of the user
 */
export const postPasswordChange = async (username: string, newPassword: string): Promise<boolean> => {
    const passwordChangeData = {
        newPassword: newPassword
    };
    const response = await fetch(`/api/auth/users/${username}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordChangeData)
    });

    if (!response.ok) {
        return false;
    }

    return true;
};

/**
 * Posts username change request data to the server
 * 
 * @param {string} oldUsername - old username of the user
 * @param {string} newUsername - new username of the user
 */
export const postUsernameChange = async (oldUsername: string, newUsername: string): Promise<boolean> => {
    const usernameChangeData = {
        newUsername: newUsername
    };
    const response = await fetch(`/api/auth/users/${oldUsername}/username`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usernameChangeData)
    });

    if (!response.ok) {
        return false;
    }

    return true;
};

/**
 * Sends a DELETE request to the server to delete a user
 * 
 * @param {string} username - username of the user to delete
 * @returns {boolean} - true if the delete was successful, false otherwise
 */
export const deleteUser = async (username: string): Promise<boolean> => {
    const response = await fetch(`/api/auth/users/${username}/delete`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        return false;
    }

    return true;
};