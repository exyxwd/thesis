import * as L from 'leaflet';
import 'leaflet.markercluster';
import React, { useEffect, useRef, useState } from 'react';
// import 'css/map.scss';
import blueMarkerIcon from 'images/marker_blue.png';
import greenMarkerIcon from 'images/marker_green.png';
import markerShadow from 'images/marker_shadow.png';
import { MinimalTrashData, filterRivers } from 'models/models';
import { useNavigate } from 'react-router-dom';
import { getFilteredRivers, isFitForFilters } from 'models/functions';
import { useActiveFilters, useSelectedTime } from './FilterContext';
// import { useActiveFilters, useSelectedTime } from './FilterContext';

/**
 * The properties of the map
 *
 * @interface MapProps
 * @property {MinimalTrashData[]} wastes The data of the waste dumps
 * @property {(data: number) => void} onMarkerClick Function to handle clicks on markers
 */
interface MapProps {
    wastes: MinimalTrashData[];
}

/**
 * Sets up the map and its markers
 * 
 * @param {MapProps} param0 garbages: The data of the garbage dumps, onMarkerClick: The function to handle the click on a marker 
 * @returns {React.ReactElement} The map
 */
const Map: React.FC<MapProps> = ({ wastes }: MapProps): React.ReactElement => {
    const map = useRef<L.Map>();
    const clusterLayer = useRef<L.MarkerClusterGroup>();
    const mapDivRef = useRef<HTMLDivElement>(null);
    const [mapData, setMapData] = useState<MinimalTrashData[]>([]);
    const activeFilters = useActiveFilters();
    const selectedTime = useSelectedTime();
    const filteredRivers = getFilteredRivers(filterRivers.filter((river) => activeFilters.some((filter) => river.name == filter)))


    const navigate = useNavigate();

    useEffect(() => {
        setMapData(wastes);
    }, [wastes]);

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
            if (!isFitForFilters(e, activeFilters, selectedTime, filteredRivers)) {
                return;
            }
            let markerIcon: L.Icon;

            if (e.status === 'STILLHERE') {
                markerIcon = L.icon({
                    iconUrl: blueMarkerIcon,
                    shadowUrl: markerShadow,
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [1, -34],
                    shadowSize: [50, 50],
                    shadowAnchor: [15, 50]
                });
            } else {
                markerIcon = L.icon({
                    iconUrl: greenMarkerIcon,
                    shadowUrl: markerShadow,
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
                    navigate(`/waste/${e.id}`)
                });
            }
        });

        map.current.addLayer(clusterLayer.current);
    }, [mapData, activeFilters, selectedTime]); // activeFilters, selectedTime

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