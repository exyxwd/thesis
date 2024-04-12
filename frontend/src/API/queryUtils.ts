import { ExpandedTrashData, MinimalTrashData } from 'models/models';
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
    const response = await fetch(`/api/wastes/filteredWastes`, {
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
    const response = await fetch(`/api/wastes/mapDataFiltered`, { method: 'GET' });
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
    const response = await fetch(`/api/wastes/mapDataFilteredInverse`, { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
};