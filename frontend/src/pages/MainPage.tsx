import React, { Profiler } from 'react';
import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { fetchFilteredWasteData, fetchFilteredInverseWasteData } from 'API/queryUtils';
import { ActiveFiltersProvider } from 'components/Main/FilterContext';
import Filters from 'components/Main/Filters';
import Map from 'components/Main/Map';
import WasteInfoPanel from 'components/Main/WasteInfoPanel';
import { MinimalTrashData } from 'models/models';

const MainPage: React.FC = (): React.ReactElement => {
    const { data: filteredWasteData, error: filteredWasteFetchError } = useQuery<MinimalTrashData[]>('filteredWastes', fetchFilteredWasteData, { staleTime: Infinity, cacheTime: Infinity });
    const { data: inverseFilteredWasteData, error: inverseFilteredWasteFetchError, isLoading } = useQuery<MinimalTrashData[]>('inverseFilteredWastes', fetchFilteredInverseWasteData, { staleTime: Infinity, cacheTime: Infinity, enabled: !!filteredWasteData });

    let { selectedMarkerId } = useParams();

    if (filteredWasteFetchError || inverseFilteredWasteFetchError) return (
        <div className='loading-error'>
            <span className="material-symbols-outlined loading-error-icon">sentiment_dissatisfied</span>
            <div><Trans i18nKey='loading_error'>Hiba az adatok betöltésekor. Próbálja újra később.</Trans></div>
        </div>
    );

    const callback = (
        id: string, // the "id" prop of the Profiler tree that has just committed
        phase: "mount" | "update" | "nested-update", // either "mount" (if the tree just mounted), "update" (if it re-rendered), or "nested-update" (if it re-rendered due to a state or prop change in a descendant)
        actualDuration: number, // time spent rendering the committed update
        baseDuration: number, // estimated time to render the entire subtree without memoization
        startTime: number, // when React began rendering this update
        commitTime: number, // when React committed this update
        interactions: Set<unknown> // the Set of interactions belonging to this update
      ) => {
        console.log(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions);
      };

    const wasteData = [...(filteredWasteData || []), ...(inverseFilteredWasteData || [])];

    return (
        <ActiveFiltersProvider>
            {wasteData.length > 0 && <Profiler id="Filters" onRender={callback}><Filters wasteData={wasteData} isLoading={isLoading} /></Profiler>}
            {wasteData.length > 0 ? <Map wastes={wasteData} /> : <div className='loader'></div>}
            {selectedMarkerId && wasteData.length > 0 && <WasteInfoPanel id={parseInt(selectedMarkerId)}
                onClose={() => { selectedMarkerId = undefined; }} key={selectedMarkerId} />}
        </ActiveFiltersProvider>
    )
}

export default MainPage;