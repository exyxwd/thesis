import { MinimalTrashData } from 'models/models';
// const baseURL = window.location.origin;
// const baseURL = 'http://localhost:8080/api';

/**
 * Fetches reduced data of all garbage dumps
 * 
 * @returns {MinimalTrashData[]} - reduced data of all garbage dumps
 */
export const fetchGarbageData = async (): Promise<MinimalTrashData[]> => {
    const response = await fetch(`api/wastes/mapData`, {method: 'GET'});
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    return response.json();
};