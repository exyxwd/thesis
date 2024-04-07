import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import React, { useEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot, faTrashCan, faSackXmark, faBottleWater, faGears, faWineGlassEmpty,
    faDrumstickBite, faPersonDigging, faDroplet, faBiohazard, faCar, faPlug, faSeedling,
    faPaw, faClock, faRuler
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { fetchWasteById } from 'API/queryUtils';
import { ExpandedTrashData } from 'models/models';


interface WasteInfoPanelProps {
    id: number;
    open: boolean;
    onClose: () => void;
}

/**
 * Sets up the waste information panel with the details of a specific waste dump
 *
 * @param {WasteInfoPanelProps} param0  id: ID of the selected waste dump,
 * open: if the sidebar is in open state, onClose: function to close the info panel
 * @returns {React.ReactElement} The waste information panel
 */
const WasteInfoPanel = ({ id, open, onClose }: WasteInfoPanelProps): React.ReactElement => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        document.addEventListener("click", handleClickElsewhere, true);
        return () => {
            document.removeEventListener("click", handleClickElsewhere);
        }
    }, [])

    /**
     * Close info panel on click elsewhere
     *
     * @param {MouseEvent} e The click event
     */
    const handleClickElsewhere = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!panelRef.current?.contains(target)) {
            onClose();
            navigate('/');
        }
    }
    /**
     * Calculates the time since the given date
     *
     * @param {Date} d The click event
     * @returns formatted string of approximate time
     */
    const timeSince = (d: Date) => {
        const currDate = new Date();
        let timeDiff = currDate.getTime() - d.getTime();

        timeDiff = timeDiff / (1000 * 60 * 60 * 24); // ms*s*min*hr get number of days
        timeDiff = Math.floor(timeDiff);

        if (timeDiff < 1) { return t('date.less_than_a_day'); }
        if ((timeDiff / 30) < 1) { return `${timeDiff} ${t('date.more_days')}`; }

        timeDiff = Math.floor(timeDiff / 30); // get number of months
        if (timeDiff == 1) {
            return `${t('date.about')} ${t('date.one_month')}`;
        }
        if ((timeDiff / 12) < 1) {
            return `${t('date.about')} ${timeDiff} ${t('date.more_months')}`;
        }

        timeDiff = Math.floor(timeDiff / 12); // get number of years
        if (timeDiff == 1) {
            return `${t('date.about')} ${t('date.one_year')}`;
        }
        return `${t('date.about')} ${timeDiff} ${t('date.more_years')}`;
    }

    function GetTypeIcon(type: string): IconProp {
        switch (type) {
            case 'PLASTIC':
                return faBottleWater;
            case 'METAL':
                return faGears;
            case 'GLASS':
                return faWineGlassEmpty;
            case 'DOMESTIC':
                return faDrumstickBite;
            case 'CONSTRUCTION':
                return faPersonDigging;
            case 'LIQUID':
                return faDroplet;
            case 'DANGEROUS':
                return faBiohazard;
            case 'AUTOMOTIVE':
                return faCar;
            case 'ELECTRONIC':
                return faPlug;
            case 'ORGANIC':
                return faSeedling;
            case 'DEADANIMALS':
                return faPaw;

            default:
                return faSackXmark;
        }
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
    };
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.resetQueries('detailedWasteData');
    }, [id, queryClient]);

    const { data } = useQuery<ExpandedTrashData>('detailedWasteData', () => {
        return fetchWasteById(id);
    });

    useEffect(() => {
        setImageLoaded(false);
        console.log('Images set');
    }, [data?.imageUrl]);

    if (!data) return (<></>)

    const trashDate = new Date(data.updateTime);

    return (
        <div className={open ? "waste-panel open" : "waste-panel"} ref={panelRef}>
            <div className='close-button-container'>
                <button className='waste-panel-close-btn' onClick={() => { onClose(); navigate('/'); }}>
                    <span className="waste-panel-close-symbol material-symbols-outlined">close</span>
                </button>
            </div>
            <div className='row waste-panel-trash-image-container'>
                {!imageLoaded && (
                    <div className='img-loader' />
                )}
                <img
                    key={data.imageUrl}
                    className='waste-panel-trash-image'
                    style={!imageLoaded ? { position: "absolute", margin: "-999px" } : {}}
                    src={data.imageUrl}
                    onLoad={handleImageLoad}
                />
            </div>
            <div className='row waste-panel-base'>
                <div className='col-6 waste-panel-header-item justify-content-center'>
                    <FontAwesomeIcon className='header-item-icon' icon={faLocationDot} />{data.locality ? data.locality : "-"}
                </div>
                <div className='col-6 waste-panel-header-item justify-content-center'>
                    <FontAwesomeIcon className='header-item-icon' icon={faTrashCan} />
                    {data.status == "STILLHERE" ?
                        <Trans i18nKey="status.stillhere">Még szennyezett</Trans> :
                        <Trans i18nKey="status.cleaned">Megtisztítva</Trans>}
                </div>
                <div className='col-6 waste-panel-header-item justify-content-center'>
                    <FontAwesomeIcon className='header-item-icon' icon={faRuler} />
                    <Trans i18nKey={'sizes.' + data.size.toLowerCase()}>{data.size}</Trans>
                </div>
                <div className='col-6 waste-panel-header-item justify-content-center'>
                    <FontAwesomeIcon className='header-item-icon' icon={faClock} />
                    {timeSince(trashDate)}
                </div>
            </div>
            <div className='row'>
                <div className='container' style={{ padding: "0px" }}>
                    <div className='row row-cols-4 justify-content-around waste-panel-types'>
                        {data.types?.map((type) => (
                            <div className='col-3 waste-panel-single-type' key={type}>
                                <div className='type-icon'>
                                    <FontAwesomeIcon icon={GetTypeIcon(type)} />
                                </div>
                                <div className='type-text text-center'>
                                    <Trans i18nKey={'types.' + type.toLowerCase()}>{type}</Trans>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col waste-panel-note-header text-center'>
                        <Trans i18nKey='details.note'>Megjegyzés</Trans>
                    </div>
                    <div className='row waste-panel-note'>
                        <div className='col'>{data.note}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WasteInfoPanel;