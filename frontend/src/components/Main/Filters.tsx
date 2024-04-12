import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import FilterItem from './FilterItem';
import Timeslider from './Timeslider';
import DownloadButton from './DownloadButton';
import { MinimalTrashData, filterRivers } from 'models/models';
import { useActiveFilters, useSelectedTime, useSetActiveFilters } from './FilterContext';
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
    status: ["STILLHERE", "CLEANED", "MORE"]
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
 * @param {MinimalTrashData[]} wasteData The data to filter
 */
interface filterProps {
    isLoading: boolean;
    wasteData: MinimalTrashData[];
}

/**
 * Sets up the filter menu
 *
 * @returns {React.ReactElement} The filter menu
 */
const Filters = ({ wasteData, isLoading }: filterProps): React.ReactElement => {
    const selectedTime = useSelectedTime();
    const activeFilters = useActiveFilters();
    const filterRef = useRef<HTMLDivElement>(null);
    const setActiveFilters = useSetActiveFilters();
    const [menuOpen, setMenuOpen] = useState(false);
    filtersData.locality = getSelectableRivers(activeFilters);

    const { data: filterMap, refetch: updateCounts } = useQuery<Map<string, number>>('filtercounts', () => createFilterCountMap());

    const filteredRivers = useMemo(() => getFilteredRivers(filterRivers.filter((river) => activeFilters.some((filter) => river.name == filter))), [activeFilters]);

    useEffect(() => {
        document.addEventListener("click", handleClickElsewhere, true);
        return () => {
            document.removeEventListener("click", handleClickElsewhere);
        }
    }, []);

    const handleClickElsewhere = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (filterRef.current && !filterRef.current.contains(target)) {
            setMenuOpen(false);
        }
    }

    useEffect(() => {
        updateCounts();
    }, [activeFilters, selectedTime]);

    const createFilterCountMap = useCallback(async (): Promise<Map<string, number>> => {
        let count = 0;
        const map = new Map<string, number>();

        Object.entries(filtersData).map(([_, filters]) => (
            filters.map((f) => {
                const riversIfSelected = getFilteredRivers(filterRivers.filter((river) => [f, ...activeFilters].some((filter) => river.name == filter)));
                wasteData.forEach((d) => {
                    if (isFitForFilters(d, [f, ...activeFilters], selectedTime, riversIfSelected)) count++;
                });
                map.set(f, count);
                count = 0;
            })
        ))
        return new Promise<Map<string, number>>(resolve => { resolve(map) });
    }, [activeFilters, selectedTime, wasteData]);

    const countFitForFilters = useMemo((): number => {
        let count = 0;
        wasteData.forEach((d) => {
            if (isFitForFilters(d, activeFilters, selectedTime, filteredRivers)) count++;
        })
        return count;
    }, [activeFilters, selectedTime, wasteData, filteredRivers]);

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
                        : <>
                            <div className='container'>
                                <div className='row filter-counter'>
                                    <div className='col-4 filter-counter-count'>
                                        <div>{countFitForFilters}</div>
                                        <Trans i18nKey="filter_names.num_fit_for_filters"></Trans>
                                    </div>
                                    <div className='col-8 filter-counter-button'>
                                        {wasteData ? <DownloadButton data={wasteData} /> : <></>}
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
                            <Timeslider />
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
                                                    count={filterMap ? filterMap.get(filter) : -1}
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