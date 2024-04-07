import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet.markercluster';
// import 'css/map.scss';
import {  MinimalTrashData } from 'models/models';
import blueMarkerIcon from 'images/marker_blue.png';
import greenMarkerIcon from 'images/marker_green.png';
import { useNavigate } from 'react-router-dom';
// import { useActiveFilters, useSelectedTime } from './FilterContext';


/**
 * Decides whether a garbage dump is fit for the active filters
 * 
 * @param {MinimalTrashData} e The data of the garbage dump 
 * @param {string[]} activeFilters The currently active filters 
 * @returns {boolean} Whether the garbage dump is fit for the active filters
 */
// const isFitForFilters = (e: MinimalTrashData | ExpandedTrashData, activeFilters: string[], selectedTime: Date): boolean => {

//     const countryFit = activeFilters.includes(e.country)
//     const riverFit = activeFilters.every((filter) => {
//         switch (filter) {
//             case 'Tisza':
//             case 'Kraszna':
//             case 'Bodrog':
//             case 'Szamos':
//             case 'Túr':
//             case 'Duna':
//                 return e.rivers ? activeFilters.some(filter => e.rivers.includes(filter)) : false
        
//             default:
//                 return true;
//         }
//     })
//     const sizeFit = activeFilters.includes(e.size)
//     const typeFit = activeFilters.every((filter) => {
//         switch (filter) {
//             case 'Plastic':
//             case 'Metal':
//             case 'Glass':
//             case 'Domestic':
//             case 'Construction':
//             case 'Liquid':
//             case 'Dangerous':
//             case 'Automotive':
//             case 'Electronic':
//             case 'Organic':
//             case 'DeadAnimals':
//                 return e.types.includes(TrashType[filter]);
        
//             default:
//                 return true;
//         }
//     })

//     const statusFit = activeFilters.includes(e.status)

//     const timeFit = selectedTime < new Date(e.updateTime)

    
//     return countryFit && sizeFit && typeFit && statusFit && riverFit && timeFit
// }

interface MapProps {
    garbages: MinimalTrashData[];
    onMarkerClick: (data: number) => void;
}

/**
 * Sets up the map and its markers
 * 
 * @param {MapProps} param0 garbages: The data of the garbage dumps, onMarkerClick: The function to handle the click on a marker 
 * @returns {React.ReactElement} The map
 */
const Map: React.FC<MapProps> = ({ garbages, onMarkerClick }: MapProps): React.ReactElement => {
    const map = useRef<L.Map>();
    const clusterLayer = useRef<L.MarkerClusterGroup>();
    const mapDivRef = useRef<HTMLDivElement>(null);
    const [mapData, setMapData] = useState<MinimalTrashData[]>([]);
    // const activeFilters = useActiveFilters();
    // const selectedTime = useSelectedTime();

    const navigate = useNavigate();

    useEffect(() => {
        setMapData(garbages);
    }, [garbages]);

    useEffect(() => {
        clusterLayer.current?.remove();

        if (!map.current) {
            return;
        }

        if (clusterLayer && clusterLayer.current) {
            map.current.removeLayer(clusterLayer.current);
        }

        clusterLayer.current = L.markerClusterGroup({
            disableClusteringAtZoom: 17,
            spiderfyOnMaxZoom: false
        });

        mapData.forEach((e) => {
            // if (!isFitForFilters(e, activeFilters, selectedTime)) {
            //     return;
            // }
            let markerIcon: L.Icon;
            if (e.status === 'STILLHERE') {
                markerIcon = L.icon({
                    iconUrl: blueMarkerIcon,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [1, -34],
                    shadowSize: [50, 50],
                    shadowAnchor: [15, 50]
                });
            } else {
                markerIcon = L.icon({
                    iconUrl: greenMarkerIcon,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [1, -34],
                    shadowSize: [50, 50],
                    shadowAnchor: [15, 50]
                });
            }

            if (clusterLayer.current) {
                const marker = L.marker(L.latLng(e.latitude, e.longitude), { icon: markerIcon }).addTo(clusterLayer.current);

                marker.on('click', () => {
                    onMarkerClick(e.id);
                    navigate(`/waste/${e.id}`)
                });
            }
        });

        map.current.addLayer(clusterLayer.current);
    }, [mapData]); // activeFilters, selectedTime

    useEffect(() => {
        if (!mapDivRef.current || map.current) {
            return;
        }
        map.current = L.map('map', { doubleClickZoom: false }).setZoom(7).setView(L.latLng(47.1611615, 19.5057541));
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 5
        }).addTo(map.current);
    });

    return (
        <div id="map" ref={mapDivRef}></div>
    );
};

export default Map;