import { MinimalTrashData, ExpandedTrashData } from 'models/models';
// const baseURL = window.location.origin;
// const baseURL = 'http://localhost:8080/api';

/**
 * Fetches reduced data of all garbage dumps
 *
 * @returns {MinimalTrashData[]} - reduced data of all garbage dumps
 */
export const fetchWasteData = async (): Promise<MinimalTrashData[]> => {
    const response = await fetch(`/api/wastes/mapData`, { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
};

/**
 * Fetches detailed data of a garbage dump
 *
 * @param {number} id - id of the garbage dump
 * @returns {ExpandedTrashData} - detailed data of the garbage dump
 */
export const fetchWasteById = async (id: number): Promise<ExpandedTrashData> => {
    const response = await fetch(`/api/wastes/${id}`, { method: 'GET' });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return await response.json();
}