import { ExpandedTrashData, MinimalTrashData, River, TrashType, filterRivers } from "./models";

/**
 * Calculates the range of the slider (minimum and maximum) and the default value
 *
 * @returns {{min: number, max: number, def: number}} The minimum, the maximum and the default value of the slider
 */
export function calcRange(): { min: number, max: number, def: number } {
    const maxDate = new Date();
    const minDate = new Date();

    minDate.setFullYear(maxDate.getFullYear() - 1);

    const max = maxDate.getTime();
    const min = minDate.getTime();

    const def = min; // (max*2+min)/3

    return { min, max, def };
}

/**
 * Decides whether a garbage dump is fit for the active filters
 *
 * @param {MinimalTrashData} e The data of the garbage dump
 * @param {string[]} activeFilters The currently active filters
 * @returns {boolean} Whether the garbage dump is fit for the active filters
 */
export const isFitForFilters = (e: MinimalTrashData | ExpandedTrashData, activeFilters: string[], selectedTime: Date, filteredRivers: (string[] | undefined)): boolean => {
    // Update Time
    if (selectedTime > new Date(e.updateTime)) return false;

    // Country
    if (!activeFilters.includes(e.country)) return false;

    // Rivers
    if (filteredRivers && !e.rivers.some((river) => filteredRivers.includes(river))) return false;

    // Size
    if (!activeFilters.includes(e.size)) return false;

    // Status
    if (!activeFilters.includes(e.status)) return false;

    // Types
    const typeFit = activeFilters.every((filter) => {
        switch (filter) {
            case 'PLASTIC':
            case 'METAL':
            case 'GLASS':
            case 'DOMESTIC':
            case 'CONSTRUCTION':
            case 'LIQUID':
            case 'DANGEROUS':
            case 'AUTOMOTIVE':
            case 'ELECTRONIC':
            case 'ORGANIC':
            case 'DEADANIMALS':
                const formattedFilter = filter.toLowerCase().charAt(0).toUpperCase() + filter.toLowerCase().slice(1);
                return e.types.includes(TrashType[formattedFilter as keyof typeof TrashType]);

            default:
                return true;
        }
    });
    if (!typeFit) return false;

    return true;
}

export const getSelectableRivers = (activeFilters: string[]): string[] => {
    //find rivers in filters
    const selectedRivers = filterRivers.filter((river) => activeFilters.some((filter) => river.name == filter))
    //if there are no rivers selected display the rank 1 rivers as options.
    if (selectedRivers.length < 1) {
        return ["DUNA", "ZALA"]
    }
    //find the highest rank river
    const highestRankRiver = selectedRivers.reduce((accumulator, currentValue) => {
        if (currentValue.rank > accumulator.rank) {
            return currentValue
        }
        else {
            return accumulator
        }
    })
    //return the selected rivers with the highest rank's tributaries

    const returnStrings = selectedRivers.map((river) => { return river.name }).concat(highestRankRiver.tributaries)

    return returnStrings
}

export const getRiversByString = (stringRivers: string[]): River[] => {
    return filterRivers.filter((river) => stringRivers.some((str) => str == river.name))
}


export const getFilteredRivers = (selectedRivers: River[]): (string[] | undefined) => {
    if (selectedRivers.length < 1) {
        return undefined
    }
    const highestRankRiver = selectedRivers.reduce((accumulator, currentValue) => {
        if (currentValue.rank > accumulator.rank) {
            return currentValue
        }
        else {
            return accumulator
        }
    })

    let riversToCheck: River[] = [highestRankRiver]
    let returnStrings: string[] = []
    while (riversToCheck.length > 0) {
        const currentlyChecking = riversToCheck.shift()
        riversToCheck = riversToCheck.concat(getRiversByString(currentlyChecking!.tributaries))
        returnStrings = returnStrings.concat(currentlyChecking!.name)
    }
    return returnStrings
}