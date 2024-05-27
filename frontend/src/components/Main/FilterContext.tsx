import React, { createContext, useContext, useState } from 'react';

import { calcRange } from 'models/functions';
import { MinimalWasteData } from 'models/models';

const ActiveFiltersContext = createContext<{
    activeFilters: string[];
    setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;

    selectedTime: Date;
    setSelectedTime: React.Dispatch<React.SetStateAction<Date>>;

    selectedWastes: MinimalWasteData[];
    setSelectedWastes: React.Dispatch<React.SetStateAction<MinimalWasteData[]>>;
} | undefined>(undefined);

/**
 * Getter for active waste filters
 *
 * @returns {string[]} The currently active filters
 */
export const useActiveFilters = (): string[] => {
    const context = useContext(ActiveFiltersContext);
    if (!context) {
        throw new Error('useActiveFilters must be used within an ActiveFiltersProvider');
    }
    return context.activeFilters;
};

/**
 * Getter for the selected time
 *
 * @returns {Date} The currently selected time
 */
export const useSelectedTime = (): Date => {
    const context = useContext(ActiveFiltersContext)
    if (!context) {
        throw new Error('useActiveFilters must be used within an ActiveFiltersProvider');
    }
    return context.selectedTime;
}

/**
 * Setter for the active waste filters
 *
 * @returns {React.Dispatch<React.SetStateAction<string[]>>} The function to set the active filters
 */
export const useSetActiveFilters = (): React.Dispatch<React.SetStateAction<string[]>> => {
    const context = useContext(ActiveFiltersContext);
    if (!context) {
        throw new Error('useSetActiveFilters must be used within an ActiveFiltersProvider');
    }
    return context.setActiveFilters;
};

/**
 * Setter for the selected time
 *
 * @returns {React.Dispatch<React.SetStateAction<Date>} The function to set the selected time
 */
export const useSetSelectedTime = (): React.Dispatch<React.SetStateAction<Date>> => {
    const context = useContext(ActiveFiltersContext)
    if (!context) {
        throw new Error('useActiveFilters must be used within an ActiveFiltersProvider');
    }
    return context.setSelectedTime;
}

/**
 * Getter for the selected wastes
 *
 * @returns {MinimalWasteData[]} The currently selected wastes
 */
export const useSelectedWastes = (): MinimalWasteData[] => {
    const context = useContext(ActiveFiltersContext)
    if (!context) {
        throw new Error('useSelectedWastes must be used within an ActiveFiltersProvider');
    }
    return context.selectedWastes;
}

/**
 * Setter for the selected wastes
 *
 * @returns {React.Dispatch<React.SetStateAction<MinimalWasteData[]>>} The function to set the selected wastes
 */
export const useSetSelectedWastes = (): React.Dispatch<React.SetStateAction<MinimalWasteData[]>> => {
    const context = useContext(ActiveFiltersContext)
    if (!context) {
        throw new Error('useSetSelectedWastes must be used within an ActiveFiltersProvider');
    }
    return context.setSelectedWastes;
}

/**
 * Wraps its children with a context provider that allows managing active filters including the selected time
 *
 * @param {Object} props The component props
 * @param {React.ReactNode} props.children The child components that will be wrapped by the context provider
 * @returns {React.ReactElement} A context provider for managing active filters
 */
export const ActiveFiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode; }): React.ReactElement => {
    const [activeFilters, setActiveFilters] = useState<string[]>(["HUNGARY", "STILLHERE", "BAG"]);
    const [selectedTime, setSelectedTime] = useState<Date>(new Date(calcRange().def));
    const [selectedWastes, setSelectedWastes] = useState<MinimalWasteData[]>([]);

    return (
        <ActiveFiltersContext.Provider value={{ activeFilters, setActiveFilters, selectedTime, setSelectedTime, selectedWastes, setSelectedWastes }}>
            {children}
        </ActiveFiltersContext.Provider>
    );
};
