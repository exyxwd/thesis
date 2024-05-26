import { ExpandedWasteData, MinimalWasteData, RegisterData, UpdateLog, UserDataType } from 'models/models';

// Get the XSRF-TOKEN cookie with regex
const getCsrfToken = () => document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, '$1');

/**
 * Error class for fetch errors
 *
 * @param {string} message - error message
 * @param {number} status - status code of the error
 * @returns {FetchError} - error object
 */
export class FetchError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

/**
 * Fetches detailed data of a waste dump
 *
 * @param {number} id - id of the waste dump
 * @returns {ExpandedWasteData} - detailed data of the waste dump
 */
export const fetchWasteById = async (id: number): Promise<ExpandedWasteData> => {
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
 * @returns {ExpandedWasteData} - detailed data of the waste dumps
 */
export const fetchMultipleWasteById = async (ids: number[]): Promise<ExpandedWasteData[]> => {
    const requestData = {
        ids: ids
    };
    const csrfToken= getCsrfToken();
    const response = await fetch('/api/wastes/filteredWastes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
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
 * @returns {MinimalWasteData[]} - reduced data of default filter fitting waste dumps
 */
export const fetchFilteredWasteData = async (): Promise<MinimalWasteData[]> => {
    const response = await fetch('/api/wastes/mapDataFiltered', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
};

/**
 * Fetches reduced data of waste dumps not fitting the default filters
 *
 * @returns {MinimalWasteData[]} - reduced data of default filter fitting waste dumps
 */
export const fetchFilteredInverseWasteData = async (): Promise<MinimalWasteData[]> => {
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

    if (!response.ok) {
        throw new FetchError('Network response was not ok.', response.status);
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

    const csrfToken= getCsrfToken();
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(loginData)
    });

    if (!response.ok) {
        throw new FetchError('Network response was not ok.', response.status);
    }

    return true;
};

/**
 * Posts logout request to the server
 */
export const postLogout = async (): Promise<boolean> => {
    const csrfToken = getCsrfToken();
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': csrfToken
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    return true;
};

/**
 * Posts admin initiated register request data to the server
 * @param {RegisterData} data - the data of the new user needed for registration
 */
export const postRegisterData = async (data: RegisterData): Promise<boolean> => {
    const csrfToken = getCsrfToken();
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new FetchError('Network response was not ok.', response.status);
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

    const csrfToken = getCsrfToken();
    const response = await fetch(`/api/auth/users/${username}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(passwordChangeData)
    });

    if (!response.ok) {
        throw new FetchError('Network response was not ok.', response.status);
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

    const csrfToken = getCsrfToken();
    const response = await fetch(`/api/auth/users/${oldUsername}/username`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(usernameChangeData)
    });

    if (!response.ok) {
        throw new FetchError('Network response was not ok.', response.status);
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
    const csrfToken = getCsrfToken();
    const response = await fetch(`/api/auth/users/${username}/delete`, {
        method: 'DELETE',
        headers: {
            'X-XSRF-TOKEN': csrfToken
        }
    });

    if (!response.ok) {
        throw new FetchError('Network response was not ok.', response.status);
    }

    return true;
};

/**
 * Fetches past database updates
 *
 * @returns {UpdateLog[]} - data of all past database updates
 */
export const fetchUpdateLogs = async (): Promise<UpdateLog[]> => {
    const response = await fetch('/api/logs', { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    
    return response.json();
};

/**
 * Sends a DELETE request to the server to delete logs
 *
 * @param {number[]} ids - ids of the logs to delete
 * @returns {boolean} - true if the request was successful, false otherwise
 */
export const deleteLogs = async (ids: number[]): Promise<boolean> => {
    const csrfToken = getCsrfToken();
    const response = await fetch('/api/logs', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(ids),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    return true;
};

/**
 * Sets the hidden status of a waste by its id
 *
 * @param {number} id - id of the waste
 * @param {boolean} hiddenStatus - new hidden status of the waste
 */
export const hideWaste = async (id: number, hiddenStatus: boolean): Promise<boolean> => {
    const hiddenStatusData = {
        hidden: hiddenStatus
    };

    const csrfToken = getCsrfToken();
    const response = await fetch(`/api/wastes/${id}/hidden`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(hiddenStatusData)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    return true;
};

/**
 * Gets all hidden wastes from the server
 *
 * @returns {ExpandedWasteData[]} - all hidden wastes
 */
export const fetchHiddenWastes = async (): Promise<ExpandedWasteData[]> => {
    const response = await fetch(`/api/wastes/hidden`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch hidden wastes');
    }

    return response.json();
};