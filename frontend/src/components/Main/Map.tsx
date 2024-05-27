import * as L from 'leaflet';
import 'leaflet.markercluster';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import blueMarkerIcon from 'images/markers/marker_blue.png';
import greenMarkerIcon from 'images/markers/marker_green.png';
import greyMarkerIcon from 'images/markers/marker_grey.png';
import markerShadow from 'images/markers/marker_shadow.png';
import yellowMarkerIcon from 'images/markers/marker_yellow.png';

import { ExpandedWasteData } from 'models/models';
import { useSelectedWastes } from './FilterContext';

/**
 * The properties of the map
 *
 * @interface MapProps
 * @property {(data: number) => void} onMarkerClick Function to handle clicks on markers
 */
interface MapProps {
    selectedWaste: ExpandedWasteData | undefined;
}

/**
 * Sets up the map and its markers
 *
 * @param {MapProps} param0 wastes: The data of the waste dumps, onMarkerClick: The function to handle tselectedWastehe click on a marker
 * @returns {React.ReactElement} The map
 */
const Map: React.FC<MapProps> = memo(({ selectedWaste }: MapProps): React.ReactElement => {
    const clusterLayer = useRef<L.MarkerClusterGroup>();
    const mapDivRef = useRef<HTMLDivElement>(null);
    const selectedWastes = useSelectedWastes();

    const { selectedMarkerId } = useParams();
    const [cameFromMarker, setCameFromMarker] = useState<boolean>(true);

    const map = useRef<L.Map>();

    const navigate = useNavigate();
    const location = useLocation();

    // Refresh the map
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

            // Set the marker icon based on the waste status, hidden status or if it is selected
            if (e.id == Number(selectedMarkerId)) iconUrl = yellowMarkerIcon
            else if (e.hidden) iconUrl = greyMarkerIcon
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

                // Trigger the waste panel opening on marker click
                marker.on('click', () => {
                    setCameFromMarker(true);
                    navigate(`/waste/${e.id}`, { state: { key: "markerClick" } });
                });

                // If the user navigated to page by an url of a marker, fly to the marker
                if (location.pathname === `/waste/${e.id}` && location.state?.key !== 'markerClick' && map.current) {
                    map.current.flyTo([selectedWaste!.latitude, selectedWaste!.longitude], 17, { duration: 2.5 });
                }
            }
        });

        map.current.addLayer(clusterLayer.current);
    }, [selectedWastes, cameFromMarker, selectedMarkerId, selectedWaste, navigate, location.pathname, location.state?.key]);

    useEffect(() => {
        if (!mapDivRef.current || map.current) {
            return;
        }

        // Set up the map and set it to Hungary
        map.current = L.map('map', { doubleClickZoom: false, attributionControl: false }).setZoom(7).setView(L.latLng(47.1611615, 19.5057541));
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 5
        }).addTo(map.current);
        // Change the position of the leaflet text to the other corner
        L.control.attribution({ position: 'bottomleft' }).addTo(map.current);
    });

    return (
        <div id="map" ref={mapDivRef}></div>
    );
});

export default Map;