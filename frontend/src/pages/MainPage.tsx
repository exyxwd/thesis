import React from 'react';
import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import Map from 'components/Main/Map';
import Filters from 'components/Main/Filters';
import WasteInfoPanel from 'components/Main/WasteInfoPanel';
import { ExpandedTrashData, MinimalTrashData } from 'models/models';
import { ActiveFiltersProvider } from 'components/Main/FilterContext';
import { fetchFilteredWasteData, fetchFilteredInverseWasteData, fetchWasteById } from 'API/queryUtils';

/**
 * The main page of the application, renders the map, the filters and the waste information panel.
 * Manages the data fetching for the children components.
 *
 * @returns {React.ReactElement} The main page
 */
const MainPage: React.FC = (): React.ReactElement => {
    console.log('MAIN component rendered');
    let { selectedMarkerId } = useParams();

    const { data: detailedWasteData } = useQuery<ExpandedTrashData>(['detailedWasteData', selectedMarkerId], () => fetchWasteById(Number(selectedMarkerId!)), { enabled: !!selectedMarkerId });
    const { data: filteredWasteData, error: filteredWasteFetchError } = useQuery<MinimalTrashData[]>('filteredWastes', fetchFilteredWasteData, { staleTime: Infinity, cacheTime: Infinity });
    const { data: inverseFilteredWasteData, error: inverseFilteredWasteFetchError, isLoading } = useQuery<MinimalTrashData[]>('inverseFilteredWastes', fetchFilteredInverseWasteData, { staleTime: Infinity, cacheTime: Infinity, enabled: !!filteredWasteData });
    
    if (filteredWasteFetchError || inverseFilteredWasteFetchError) return (
        <div className='loading-error'>
            <span className="material-symbols-outlined loading-error-icon">sentiment_dissatisfied</span>
            <div><Trans i18nKey='loading_error'>Hiba az adatok betöltésekor. Próbálja újra később.</Trans></div>
        </div>
    );

    const wasteData = [...(filteredWasteData || []), ...(inverseFilteredWasteData || [])];

    return (
        <ActiveFiltersProvider>
            {filteredWasteData && <Filters wasteData={wasteData} isLoading={isLoading} />}
            {wasteData.length > 0 ? <Map wastes={wasteData} selectedWaste={detailedWasteData} /> : <div className='loader'></div>}
            {selectedMarkerId && detailedWasteData && Number(selectedMarkerId) === detailedWasteData.id && <WasteInfoPanel
            data={detailedWasteData} onClose={() => { selectedMarkerId = undefined; }} key={selectedMarkerId} />}
        </ActiveFiltersProvider>
    )
}

export default MainPage;