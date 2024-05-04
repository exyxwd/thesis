import * as XLSX from 'xlsx';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useSelectedWastes } from './FilterContext';
import { fetchMultipleWasteById } from 'API/queryUtils';
import { useShowNotification } from './NotificationContext';
import { ExpandedTrashData, NotificationType } from 'models/models';

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
 * @param {ExpandedTrashData[]} fetchedData The data to download
 * @param {(key: string) => string} t The translation function
 * @returns {void}
 */
function downloadData(fetchedData: ExpandedTrashData[], t: (key: string) => string): void {
    // Translate the data and format the date
    const translatedData = fetchedData.map(item => ({
        ...item,
        country: t(`country.${item.country.toLowerCase()}`),
        status: t(`status.${item.status.toLowerCase()}`),
        size: t(`sizes.${item.size.toLowerCase()}`),
        types: item.types.map(type => t(`types.${type.toLowerCase()}`)).join(', '),
        rivers: item.rivers.map(river => river.toLowerCase().charAt(0).toUpperCase() + river.toLowerCase().slice(1)).join(', '),
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
 * Creates the download button for selected waste dumps and triggers the download
 *
 * @returns {React.ReactElement} Download button
 */
const DownloadButton: React.FC = (): React.ReactElement => {
    const [shouldFetch, setShouldFetch] = useState<boolean>(false);
    const showNotification = useShowNotification();
    const selectedWastes = useSelectedWastes();
    const { t } = useTranslation();

    // Fetch the selected waste dumps data and trigger the download on success
    useQuery('filteredData', () => fetchMultipleWasteById(selectedWastes.map(item => item.id)),
        {
            enabled: shouldFetch, onSuccess: (fetchedData) => { downloadData(fetchedData, t); setShouldFetch(false); },
            onError: () => showNotification(NotificationType.Error, "download_fail")
        });

    const downloadHandler = () => {
        setShouldFetch(true);
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
