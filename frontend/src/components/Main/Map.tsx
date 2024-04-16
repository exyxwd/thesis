import * as L from 'leaflet';
import 'leaflet.markercluster';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import blueMarkerIcon from 'images/marker_blue.png';
import markerShadow from 'images/marker_shadow.png';
import greenMarkerIcon from 'images/marker_green.png';
import yellowMarkerIcon from 'images/marker_yellow.png';

import { ExpandedTrashData } from 'models/models';
import { useSelectedWastes } from './FilterContext';

/**
 * The properties of the map
 *
 * @interface MapProps
 * @property {(data: number) => void} onMarkerClick Function to handle clicks on markers
 */
interface MapProps {
    selectedWaste: ExpandedTrashData | undefined;
}

/**
 * Sets up the map and its markers
 *
 * @param {MapProps} param0 garbages: The data of the garbage dumps, onMarkerClick: The function to handle tselectedWastehe click on a marker 
 * @returns {React.ReactElement} The map
 */
const Map: React.FC<MapProps> = memo(({ selectedWaste }: MapProps): React.ReactElement => {
    const clusterLayer = useRef<L.MarkerClusterGroup>();
    const mapDivRef = useRef<HTMLDivElement>(null);
    const selectedWastes = useSelectedWastes();

    let { selectedMarkerId } = useParams();
    const [cameFromMarker, setCameFromMarker] = useState<boolean>(true);

    const map = useRef<L.Map>();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!selectedMarkerId && cameFromMarker) {
            setCameFromMarker(false);
            return;
        }
        clusterLayer.current?.remove();

        if (!map.current) return;

        if (clusterLayer && clusterLayer.current) {
            map.current.removeLayer(clusterLayer.current);
        }

        clusterLayer.current = L.markerClusterGroup({
            disableClusteringAtZoom: 17,
            spiderfyOnMaxZoom: false
        });

        selectedWastes.forEach((e) => {
            let iconUrl: string;

            if (e.id == Number(selectedMarkerId)) iconUrl = yellowMarkerIcon
            else if (e.status === 'STILLHERE' || e.status === 'MORE') iconUrl = blueMarkerIcon
            else iconUrl = greenMarkerIcon

            const markerIcon = L.icon({
                iconUrl: iconUrl,
                shadowUrl: markerShadow,
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [1, -34],
                shadowSize: [50, 50],
                shadowAnchor: [15, 50]
            });
            
            if (clusterLayer.current) {
                const marker = L.marker(L.latLng(e.latitude, e.longitude), { icon: markerIcon }).addTo(clusterLayer.current);

                marker.on('click', () => {
                    setCameFromMarker(true);
                    navigate(`/waste/${e.id}`, { state: { key: "markerClick" }  });
                });

                if (location.pathname === `/waste/${e.id}` && location.state?.key !== 'markerClick') {
                    map.current?.flyTo([selectedWaste!.latitude, selectedWaste!.longitude], 17, { duration: 2.5 });
                }
            }
        });

        map.current.addLayer(clusterLayer.current);
    }, [selectedWastes, cameFromMarker, selectedMarkerId]);

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
});

export default Map;