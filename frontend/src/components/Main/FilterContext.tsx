import React, { createContext, useContext, useState } from 'react';
import { calcRange } from 'models/functions';

const ActiveFiltersContext = createContext<{
    activeFilters: string[];
    setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;

    selectedTime: Date;
    setSelectedTime: React.Dispatch<React.SetStateAction<Date>>;
} | undefined>(undefined);

/**
 * Getter for active garbage filters
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

export const useSelectedTime = (): Date => {
    const context = useContext(ActiveFiltersContext)
    if (!context) {
        throw new Error('useActiveFilters must be used within an ActiveFiltersProvider');
    }
    return context.selectedTime;
}

/**
 * Setter for the active garbage filters
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

export const useSetSelectedTime = (): React.Dispatch<React.SetStateAction<Date>> => {
    const context = useContext(ActiveFiltersContext)
    if (!context) {
        throw new Error('useActiveFilters must be used within an ActiveFiltersProvider');
    }
    return context.setSelectedTime;
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

    return (
        <ActiveFiltersContext.Provider value={{ activeFilters, setActiveFilters, selectedTime, setSelectedTime }}>
            {children}
        </ActiveFiltersContext.Provider>
    );
};
