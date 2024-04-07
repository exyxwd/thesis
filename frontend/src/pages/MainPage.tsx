import { Trans } from 'react-i18next';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import Map from 'components/Main/Map';
import { fetchWasteData } from 'API/queryUtils';
import { MinimalTrashData } from 'models/models';
import WasteInfoPanel from 'components/Main/WasteInfoPanel';
import { ActiveFiltersProvider } from 'components/Main/FilterContext';

/**
 * Wrapper for the components that make up the main page, handles the fetching for the Map component
 *
 * @returns {React.ReactElement} Main page
 */
const MainPage: React.FC = (): React.ReactElement => {
    const { data: garbageData, error: garbageError } = useQuery<MinimalTrashData[]>('garbages', fetchWasteData, { staleTime: Infinity, cacheTime: Infinity });
    const [infoPanelOpen, setInfoPanelOpen] = useState(false);
    let { selectedMarkerId } = useParams();

    if (garbageError) return (
        <div className='loading-error'>
            <span className="material-symbols-outlined loading-error-icon">sentiment_dissatisfied</span>
            <div><Trans i18nKey='loading_error'>Hiba az adatok betöltésekor. Próbálja újra később.</Trans></div>
        </div>
    );

    if (selectedMarkerId && !infoPanelOpen) setInfoPanelOpen(true);

    return (
        <ActiveFiltersProvider>
            {selectedMarkerId && <WasteInfoPanel open={infoPanelOpen} id={parseInt(selectedMarkerId)} onClose={() => { setInfoPanelOpen(false); selectedMarkerId = undefined; }} key={selectedMarkerId} />}
            {garbageData ? <Map garbages={garbageData} onMarkerClick={() => setInfoPanelOpen(true)} /> : <div className='loader'></div>}
        </ActiveFiltersProvider>
    )
}

export default MainPage;
