import React, { useState } from 'react'
import { useQuery } from 'react-query';
import Map from 'components/Main/Map';
import { MinimalTrashData, TrashCountry, TrashSize, TrashType, TrashStatus } from 'models/models';
// import { Filters } from 'components/Main/Filters';
import { fetchGarbageData } from 'API/queryUtils';
// import { ActiveFiltersProvider } from 'components/Main/FilterContext';
// import { TrashSideBar } from 'components/Main/TrashSideBar';
import { Trans } from 'react-i18next';

/**
 * Wrapper for the components that make up the main page, handles the fetching for the Map component
 * 
 * @returns {React.ReactElement} Main page
 */
const MainPage: React.FC = (): React.ReactElement => {
    const { data: garbageData, error: garbageError } = useQuery<MinimalTrashData[]>('garbages', fetchGarbageData, { staleTime: Infinity, cacheTime: Infinity });
    // const [sidebarOpen, setSideBarOpen] = useState(false)
    // const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

    if (garbageError) return (
        <div className='loading-error'>
            <span className="material-symbols-outlined loading-error-icon">sentiment_dissatisfied</span>
            <div><Trans i18nKey='loading_error'>Hiba az adatok betöltésekor. Próbálja újra később.</Trans></div>
        </div>
    );
    else{
        console.log(garbageData);
    }
    const example: MinimalTrashData[] = [{
        id: 1,
        latitude: 0,
        longitude: 0,
        country: TrashCountry.Hungary,
        size: TrashSize.Bag,
        status: TrashStatus.StillHere,
        types: [TrashType.Plastic],
        rivers: ['Duna'],
        updateTime: 'idk'
    }];

    const handleMarkerClick = (id: number) => {
        console.log(id);
    }

    return (
        <>
            {/* <ActiveFiltersProvider>
                {selectedMarkerId ? <TrashSideBar open={sidebarOpen} id={selectedMarkerId} onClose={() => setSideBarOpen(false)} key={selectedMarkerId}/> : <></>}
                {garbageData ? (<Map garbages={garbageData} onMarkerClick={(id) => {setSelectedMarkerId(id); setSideBarOpen(true)}} />) : (<div className='loader'></div>)}
                {garbageData ? <Filters garbageData={garbageData}/> : <></>}
            </ActiveFiltersProvider> */}
            {garbageData ? <Map garbages={garbageData} onMarkerClick={handleMarkerClick}/>: <div className='loader'></div>}
        </>
    )
}

export default MainPage;
