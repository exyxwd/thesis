import { ExpandedTrashData, MinimalTrashData, River, TrashType, filterRivers } from "./models";

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
 * @param {MinimalTrashData} e The data of the waste dump
 * @param {string[]} activeFilters The currently active filters
 * @returns {boolean} Whether the waste dump is fit for the active filters
 */
export const isFitForFilters = (authenticated: boolean, e: MinimalTrashData | ExpandedTrashData, activeFilters: string[],
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
        return !(TrashType[formattedFilter as keyof typeof TrashType] && !e.types.includes(TrashType[formattedFilter as keyof typeof TrashType]));
    });
    if (!typeFit) return false;

    return true;
}

export const getSelectableRivers = (activeFilters: string[]): string[] => {
    const selectedRivers = filterRivers.filter((river) => activeFilters.includes(river.name));

    if (selectedRivers.length === 0) {
        return ["DUNA", "ZALA"];
    }

    const highestRankRiver = selectedRivers.reduce((acc, cur) => cur.rank > acc.rank ? cur : acc);
    return [...selectedRivers.map(river => river.name), ...highestRankRiver.tributaries];
}

export const getRiversByString = (stringRivers: string[]): River[] => {
    return filterRivers.filter((river) => stringRivers.includes(river.name))
}


export const getFilteredRivers = (selectedRivers: River[]): (string[] | undefined) => {
    if (selectedRivers.length === 0) {
        return undefined;
    }

    const highestRankRiver = selectedRivers.reduce((acc, cur) => cur.rank > acc.rank ? cur : acc);

    let riversToCheck: River[] = [highestRankRiver];
    let returnStrings: string[] = [];

    while (riversToCheck.length > 0) {
        const currentlyChecking = riversToCheck.shift();
        riversToCheck = [...riversToCheck, ...getRiversByString(currentlyChecking!.tributaries)];
        returnStrings = [...returnStrings, currentlyChecking!.name];
    }

    return returnStrings;
}