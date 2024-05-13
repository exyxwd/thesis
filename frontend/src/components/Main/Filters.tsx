import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import FilterItem from './FilterItem';
import TimeSlider from './TimeSlider';
import DownloadButton from './DownloadButton';
import { MinimalTrashData, filterRivers } from 'models/models';
import { useAuthenticated } from 'components/Dashboard/AuthContext';
import { useActiveFilters, useSelectedTime, useSelectedWastes, useSetActiveFilters } from './FilterContext';
import { getFilteredRivers, getRiversByString, getSelectableRivers, isFitForFilters } from 'models/functions';

/**
 * Grouped waste filters
 */
const filtersData = {
    country: ["HUNGARY", "UKRAINE", "ROMANIA", "SERBIA", "SLOVAKIA"],
    locality: ["DUNA", "ZALA"],
    size: ["BAG", "WHEELBARROW", "CAR"],
    type: ["PLASTIC", "METAL", "GLASS", "DOMESTIC", "CONSTRUCTION", "LIQUID",
        "DANGEROUS", "AUTOMOTIVE", "ELECTRONIC", "ORGANIC", "DEADANIMALS"],
    status: ["STILLHERE", "MORE", "CLEANED"]
};

interface FilterName {
    [key: string]: string | undefined
}

const filterNames: FilterName = {
    locality: "Place",
    size: "Size",
    type: "Type",
    status: "State",
    country: "Country"
}

/**
 * Props for the filter menu
 *
 * @param {boolean} isLoading Whether the data is still loading (has not fetched yet)
 * @param {boolean} isError Whether an error occurred while fetching the data
 * @param {MinimalTrashData[]} wasteData The data to filter
 */
interface filterProps {
    isLoading: boolean;
    wasteData: MinimalTrashData[];
    isError: boolean | unknown;
}

/**
 * Sets up the filter menu
 *
 * @returns {React.ReactElement} The filter menu
 */
const Filters = ({ wasteData, isError, isLoading }: filterProps): React.ReactElement => {
    const selectedTime = useSelectedTime();
    const activeFilters = useActiveFilters();
    const selectedWastes = useSelectedWastes();
    const filterRef = useRef<HTMLDivElement>(null);
    const setActiveFilters = useSetActiveFilters();
    const [menuOpen, setMenuOpen] = useState(false);
    filtersData.locality = getSelectableRivers(activeFilters);
    const [countFitForFilters, setCountFitForFilters] = useState(0);
    const authenticated = useAuthenticated();
    const {data: filterMap, refetch: updateCounts} = useQuery<Map<string,number>>('filtercounts', () => filterCount());

    useEffect(() => {
        document.addEventListener("click", handleClickElsewhere, true);
        return () => {
            document.removeEventListener("click", handleClickElsewhere);
        }
    }, []);

    useEffect(() => {
        updateCounts();
    }, [wasteData, countFitForFilters, selectedTime, updateCounts]);

    useEffect(() => {
        setCountFitForFilters(selectedWastes.length);
    }, [selectedWastes, activeFilters, selectedTime]);

    async function filterCount():Promise<Map<string,number>> {
        const map = new Map<string,number>();
        
        const notSelectedWastes = wasteData.filter(waste => !selectedWastes.includes(waste));
        Object.entries(filtersData).map(([filterType, filters]) => (
            filters.map((filter) => {
                // If the filter is active, the count is the number of currently selected wastes
                if (activeFilters.includes(filter)) {
                    map.set(filter, countFitForFilters);
                    return;
                }
                const riversIfSelected = getFilteredRivers(filterRivers.filter(river => [filter, ...activeFilters].includes(river.name)));

                // If the filter is type or locality filter, only count through the selected wastes since the filter will only narrow them down
                // Otherwise count through the not selected wastes, since the filter will expand the selection, keeping all currently selected
                const isFilterConstrictType = filterType === 'type' || filterType === 'locality';
                const dataToIterate = isFilterConstrictType ? selectedWastes : notSelectedWastes;

                let count = 0;
                dataToIterate.forEach((waste) => {
                    if (isFitForFilters(authenticated, waste, [filter, ...activeFilters], selectedTime, riversIfSelected)) {
                        count++;
                    }
                });

                // Add the number of currently selected wastes to the count if the filter is not a type or locality filter,
                // because only the not selected wastes were counted
                map.set(filter, isFilterConstrictType ? count : count + countFitForFilters);
            })
        ))
        return map;
    }

    const handleClickElsewhere = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (filterRef.current && !filterRef.current.contains(target)) {
            setMenuOpen(false);
        }
    }

    function showWarning(category: string): boolean {
        switch (category) {
            case 'country':
                return !activeFilters.some((f) => { return filtersData['country'].includes(f) });
            case 'size':
                return !activeFilters.some((f) => { return filtersData['size'].includes(f) });
            case 'status':
                return !activeFilters.some((f) => { return filtersData['status'].includes(f) });
            default:
                return false;
        }
    }

    const setFilterState = useCallback((filter: string) => {
        if (activeFilters.includes(filter)) {
            setActiveFilters(prevFilters => prevFilters.filter((str) => str !== filter));
            const riverUnselected = getRiversByString([filter]);
            if (riverUnselected.length > 0) {
                const rankOfUnselectedRiver = riverUnselected[0].rank;
                const selectedRivers = getRiversByString(activeFilters);
                const riversToUnselect = selectedRivers.filter((river) => river.rank >= rankOfUnselectedRiver);
                setActiveFilters(prevFilters => prevFilters.filter((str) => !riversToUnselect.some((river) => river.name == str)));
            }
        } else {
            setActiveFilters(prevFilters => [...prevFilters, filter]);
        }
    }, [activeFilters, setActiveFilters]);



    return (
        <div className={menuOpen ? 'active' : ''} id='filter-menu' ref={filterRef}>
            <button className='btn filter-button' onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ?
                    <span className="material-symbols-outlined">
                        close
                    </span> :
                    <span className="material-symbols-outlined">
                        filter_alt
                    </span>
                }
            </button>
            <div className='filter-container'>
                <div className='col filter-col'>
                    {isLoading ? <div id='filter-loader' className='loader'></div>
                        : isError ? <div className='filter-loading-error'>
                        <span className="material-symbols-outlined loading-error-icon">sentiment_dissatisfied</span>
                        <div><Trans i18nKey='loading_error'>Hiba az adatok betöltésekor. Próbálja újra később.</Trans></div>
                    </div> :<>
                            <div className='container'>
                                <div className='row filter-counter'>
                                    <div className='col-4 filter-counter-count'>
                                        <div>{countFitForFilters}</div>
                                        <Trans i18nKey="filter_names.num_fit_for_filters"></Trans>
                                    </div>
                                    <div className='col-8 filter-counter-button'>
                                        {wasteData ? <DownloadButton /> : <></>}
                                    </div>
                                </div>
                            </div>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-auto'>
                                        <h4><Trans i18nKey='filter_names.time'></Trans></h4>
                                    </div>
                                </div>
                            </div>
                            <TimeSlider />
                            {Object.entries(filtersData).map(([category, filters]) => ((
                                <div className='container' key={category}>
                                    <div className='row'>
                                        <div className='col-auto'>
                                            <h4><Trans i18nKey={`filter_names.${filterNames[category]?.toLowerCase()}`}>{filterNames[category]}</Trans></h4>
                                        </div>
                                        {showWarning(category) ? <div className='col filter-category-warning'>
                                            <Trans i18nKey={`filter_names.${filterNames[category]?.toLowerCase()}_warning`}></Trans>
                                        </div> : <></>}
                                    </div>
                                    <div className='row row-cols-auto filter-row'>
                                        {filters.map((filter) =>
                                            <div className='col' key={filter}>
                                                <FilterItem
                                                    content={filter}
                                                    selected={activeFilters.includes(filter)}
                                                    count={!filterMap ? 1 : filterMap.get(filter)}
                                                    OnSelect={(str) => setFilterState(str)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>)
                            ))}
                        </>}
                </div>
            </div>
        </div>
    );
}

export default Filters;