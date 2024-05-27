import { ExpandedWasteData, MinimalWasteData, River, WasteType, filterRivers } from "./models";

/**
 * Calculates the range of the slider (minimum and maximum) and the default value
 *
 * @returns {{min: number, max: number, def: number}} The minimum, the maximum and the default value of the slider
 */
export function calcRange(): { min: number, max: number, def: number } {
    const maxDate = new Date();
    const minDate = new Date();
    const defDate = new Date();

    minDate.setFullYear(maxDate.getFullYear() - 6);
    defDate.setFullYear(maxDate.getFullYear() - 1);

    const max = maxDate.getTime();
    const min = minDate.getTime();
    const def = defDate.getTime();

    return { min, max, def };
}

/**
 * Decides whether a waste dump is fit for the active filters
 *
 * @param {MinimalWasteData} e The data of the waste dump
 * @param {string[]} activeFilters The currently active filters
 * @returns {boolean} Whether the waste dump is fit for the active filters
 */
export const isFitForFilters = (authenticated: boolean, e: MinimalWasteData | ExpandedWasteData, activeFilters: string[],
    selectedTime: Date, filteredRivers: (string[] | undefined)): boolean => {
    // Visibility
    if (e.hidden && !authenticated) return false;

    // Update Time
    if (selectedTime > new Date(e.updateTime)) return false;

    // Country
    if (!activeFilters.includes(e.country)) return false;

    // River
    if (filteredRivers && !filteredRivers.includes(e.river)) return false;

    // Size
    if (!activeFilters.includes(e.size)) return false;

    // Status
    if (!activeFilters.includes(e.status)) return false;

    // Types
    const typeFit = activeFilters.every((filter) => {
        const formattedFilter = filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase();
        return !(WasteType[formattedFilter as keyof typeof WasteType] && !e.types.includes(WasteType[formattedFilter as keyof typeof WasteType]));
    });
    if (!typeFit) return false;

    return true;
}

/**
 * Returns the rivers that are selectable
 *
 * @param activeFilters The currently active filters
 * @returns The rivers that are selectable
 */
export const getSelectableRivers = (activeFilters: string[]): string[] => {
    const selectedRivers = filterRivers.filter((river) => activeFilters.includes(river.name));

    if (selectedRivers.length === 0) {
        return ["DUNA", "ZALA"];
    }

    // Find the highest ranked river
    const highestRankRiver = selectedRivers.reduce((acc, cur) => cur.rank > acc.rank ? cur : acc);

    // Return the selected rivers names and the tributaries names of the highest ranked river
    return [...selectedRivers.map(river => river.name), ...highestRankRiver.tributaries];
}

/**
 * Maps river names to River objects
 *
 * @param stringRivers The river names
 * @returns The River objects that correspond to the river names
 */
export const getRiversByString = (stringRivers: string[]): River[] => {
    return filterRivers.filter((river) => stringRivers.includes(river.name))
}

/**
 * Returns the river names that are selected
 *
 * @param selectedRivers The currently selected rivers
 * @returns The names of the rivers that are selected
 */
export const getFilteredRivers = (selectedRivers: River[]): (string[] | undefined) => {
    if (selectedRivers.length === 0) {
        return undefined;
    }

    // Find the highest ranked river
    const highestRankRiver = selectedRivers.reduce((acc, cur) => cur.rank > acc.rank ? cur : acc);

    let riversToCheck: River[] = [highestRankRiver];
    let returnStrings: string[] = [];

    // Check the tributaries of the highest ranked river
    while (riversToCheck.length > 0) {
        const currentlyChecking = riversToCheck.shift();
        riversToCheck = [...riversToCheck, ...getRiversByString(currentlyChecking!.tributaries)];
        returnStrings = [...returnStrings, currentlyChecking!.name];
    }

    return returnStrings;
}