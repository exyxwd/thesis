import React, { Profiler } from 'react';
import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { fetchWasteData } from 'API/queryUtils';
import { ActiveFiltersProvider } from 'components/Main/FilterContext';
import Filters from 'components/Main/Filters';
import Map from 'components/Main/Map';
import WasteInfoPanel from 'components/Main/WasteInfoPanel';
import { MinimalTrashData } from 'models/models';

/**
 * Wrapper for the components that make up the main page, handles the fetching for the Map component
 *
 * @returns {React.ReactElement} Main page
 */
const MainPage: React.FC = (): React.ReactElement => {
    const { data: wasteData, error: wasteFetchError } = useQuery<MinimalTrashData[]>('wastes', fetchWasteData, { staleTime: Infinity, cacheTime: Infinity });
    let { selectedMarkerId } = useParams();

    if (wasteFetchError) return (
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

    return (
        <ActiveFiltersProvider>
            {wasteData && <Profiler id="Filters" onRender={callback}><Filters wasteData={wasteData} /></Profiler>}
            {wasteData ? <Map wastes={wasteData} /> : <div className='loader'></div>}
            {selectedMarkerId && wasteData && <WasteInfoPanel id={parseInt(selectedMarkerId)}
                onClose={() => { selectedMarkerId = undefined; }} key={selectedMarkerId} />}
        </ActiveFiltersProvider>
    )
}

export default MainPage;
