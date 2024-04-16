import React, { useEffect, useMemo, useState } from 'react';

import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import Map from 'components/Main/Map';
import Filters from 'components/Main/Filters';
import WasteInfoPanel from 'components/Main/WasteInfoPanel';
import { getFilteredRivers, isFitForFilters } from 'models/functions';
import { ExpandedTrashData, MinimalTrashData, filterRivers } from 'models/models';
import { fetchFilteredWasteData, fetchFilteredInverseWasteData, fetchWasteById } from 'API/queryUtils';
import { useActiveFilters, useSelectedTime, useSetSelectedWastes } from 'components/Main/FilterContext';

/**
 * The main page of the application, renders the map, the filters and the waste information panel.
 * Manages the data fetching for the children components.
 *
 * @returns {React.ReactElement} The main page
 */
const MainPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate();
    let { selectedMarkerId } = useParams();

    const selectedTime = useSelectedTime();
    const activeFilters = useActiveFilters();
    const setSelectedWastes = useSetSelectedWastes();
    const [wasteData, setWasteData] = useState<MinimalTrashData[]>([]);
    const filteredRivers = useMemo(() => getFilteredRivers(filterRivers.filter((river) => activeFilters.some((filter) => river.name == filter))), [activeFilters]);

    const { data: detailedWasteData } = useQuery<ExpandedTrashData>(
        ['detailedWasteData', selectedMarkerId],
        () => fetchWasteById(Number(selectedMarkerId!)),
        { enabled: !!selectedMarkerId }
    );
    const { data: filteredWasteData, error: filteredWasteFetchError } = useQuery<MinimalTrashData[]>(
        'filteredWastes',
        fetchFilteredWasteData,
        { staleTime: Infinity, cacheTime: Infinity }
    );
    const { data: inverseFilteredWasteData, error: inverseFilteredWasteFetchError, isLoading } = useQuery<MinimalTrashData[]>(
        'inverseFilteredWastes',
        fetchFilteredInverseWasteData,
        { staleTime: Infinity, cacheTime: Infinity, enabled: !!filteredWasteData }
    );

    useEffect(() => {
        setSelectedWastes(wasteData.filter((waste) => isFitForFilters(waste, activeFilters, selectedTime, filteredRivers)));
    }, [wasteData, activeFilters, selectedTime, filteredRivers]);

    useEffect(() => {
        setWasteData([...(filteredWasteData || []), ...(inverseFilteredWasteData || [])]);
    }, [filteredWasteData, inverseFilteredWasteData]);

    if (filteredWasteFetchError || inverseFilteredWasteFetchError) return (
        <div className='loading-error'>
            <span className="material-symbols-outlined loading-error-icon">sentiment_dissatisfied</span>
            <div><Trans i18nKey='loading_error'>Hiba az adatok betöltésekor. Próbálja újra később.</Trans></div>
        </div>
    );

    return (
        <>
            {wasteData.length > 0 ? <Map selectedWaste={detailedWasteData} /> : <div className='loader'></div>}
            {selectedMarkerId && detailedWasteData && Number(selectedMarkerId) === detailedWasteData.id && <WasteInfoPanel
                data={detailedWasteData} onClose={() => { selectedMarkerId = undefined; navigate("/"); }} key={selectedMarkerId} />}
            {wasteData.length > 0 && <Filters wasteData={wasteData} isLoading={isLoading} />}
        </>
    )
}

export default MainPage;