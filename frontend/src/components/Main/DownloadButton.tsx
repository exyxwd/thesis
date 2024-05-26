import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import * as XLSX from 'xlsx';

import { fetchMultipleWasteById } from 'API/queryUtils';
import { ExpandedWasteData, MinimalWasteData, NotificationType } from 'models/models';
import { useShowNotification } from './NotificationContext';

/**
 * ISO datetime format to human readable format (yyyy. mm. dd. hh:mm)
 *
 * @param {string} inputDateTime  Datetime in ISO format
 * @returns {string} Formatted date and time
 */
function formatDateTime(inputDateTime: string): string {
    const dateObj = new Date(inputDateTime);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hour = dateObj.getHours().toString().padStart(2, '0');
    const minute = dateObj.getMinutes().toString().padStart(2, '0');

    return `${year}. ${month}. ${day}. ${hour}:${minute}`;
}

/**
 * Prepares data for download (translates it, sets column widths) and downloads it as xlsx
 *
 * @param {ExpandedWasteData[]} fetchedData The data to download
 * @param {(key: string) => string} t The translation function
 * @returns {void}
 */
function downloadData(fetchedData: ExpandedWasteData[], t: (key: string) => string): void {
    // Translate the data and format the date, exclude the hidden field (the warning is disabled because the hidden field is not used to be excluded)
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const translatedData = fetchedData.map(({ hidden, ...item }) => ({
        ...item,
        country: t(`country.${item.country.toLowerCase()}`),
        status: t(`status.${item.status.toLowerCase()}`),
        size: t(`sizes.${item.size.toLowerCase()}`),
        types: item.types.map(type => t(`types.${type.toLowerCase()}`)).join(', '),
        river: item.river.toLowerCase().charAt(0).toUpperCase() + item.river.toLowerCase().slice(1),
        createTime: formatDateTime(item.createTime),
        updateTime: formatDateTime(item.updateTime)
    }));

    // Translate the headers
    const headings = Object.keys(translatedData[0]);
    const headingRow = headings.map(heading => t('details.' + heading));

    // Include header lengths when calculating column widths
    const columnWidths: number[] = Array.from({ length: headingRow.length }, () => 0);

    // Calculate the width of each column based on headers and content
    headings.forEach((key, columnIndex) => {
        const headerContent = headingRow[columnIndex];
        const headerContentLength = headerContent.toString().length;
        columnWidths[columnIndex] = Math.max(columnWidths[columnIndex], headerContentLength);

        translatedData.forEach(rowData => {
            const content = rowData[key as keyof typeof rowData];
            const contentString = content !== null ? content.toString() : '-';
            const contentLength = contentString.length;

            columnWidths[columnIndex] = Math.max(columnWidths[columnIndex], contentLength);
        });
    });

    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    ws['!cols'] = columnWidths.map(width => ({ width }));

    XLSX.utils.sheet_add_aoa(ws, [headingRow]);
    XLSX.utils.sheet_add_json(ws, translatedData, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws);

    // Download the file
    XLSX.writeFile(wb, `${t('details.file_name')}.xlsx`);
}

/**
 * Interface for the DownloadButton component props
 * 
 * @property {MinimalWasteData[]} selectedWastes The selected waste dumps to download
 */
interface DownloadButtonProps {
    selectedWastes: MinimalWasteData[];
}

/**
 * Creates the download button for selected waste dumps and triggers the download
 *
 * @returns {React.ReactElement} Download button
 */
const DownloadButton: React.FC<DownloadButtonProps> = ({ selectedWastes }): React.ReactElement => {
    const [shouldFetch, setShouldFetch] = useState<boolean>(false);
    const showNotification = useShowNotification();
    const { t } = useTranslation();

    // Fetch the selected waste dumps data and trigger the download on success
    useQuery('filteredData', () => fetchMultipleWasteById(selectedWastes.map(item => item.id)),
        {
            enabled: shouldFetch, onSuccess: (fetchedData) => { downloadData(fetchedData, t); setShouldFetch(false); },
            onError: () => { showNotification(NotificationType.Error, "download_fail"); setShouldFetch(false); }
        });

    const downloadHandler = () => {
        if (selectedWastes.length > 0) {
            setShouldFetch(true);
        } else {
            showNotification(NotificationType.Error, "no_waste_selected");
        }
    }

    return (
        <button className='btn download-button' onClick={downloadHandler}>
            {shouldFetch ? <div className='download-loader'></div>
                : <span className='material-symbols-outlined' >
                    download
                </span>}
            <div id='download-button-text'>
                <Trans i18nKey="filter_names.download_btn_text"></Trans>
            </div>
        </button>
    );
}

export default DownloadButton;
