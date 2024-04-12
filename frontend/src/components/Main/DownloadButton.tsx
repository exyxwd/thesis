import React, { useState } from 'react';
import { useQuery } from 'react-query';
import * as XLSX from 'xlsx';

import { fetchMultipleWasteById } from 'API/queryUtils';
import { getFilteredRivers, isFitForFilters } from 'models/functions';
import { ExpandedTrashData, MinimalTrashData, filterRivers } from 'models/models';
import { Trans, useTranslation } from 'react-i18next';
import { useActiveFilters, useSelectedTime } from './FilterContext';

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
 */
function downloadData(fetchedData: ExpandedTrashData[], t: (key: string) => string) {
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

interface DownloaderProps {
    data: MinimalTrashData[];
}

/**
 * Creates the download button for selected waste dumps and triggers the download
 * 
 * @param {DownloaderProps} param0 data: the data that gets filtered by the selected filters
 * @returns {React.ReactElement} Download button
 */
const DownloadButton: React.FC<DownloaderProps> = ({ data }: DownloaderProps): React.ReactElement => {
    const selectedTime = useSelectedTime();
    const activeFilters = useActiveFilters();
    const { t } = useTranslation();
    const [shouldFetch, setShouldFetch] = useState<boolean>(false);
    const filteredRivers = getFilteredRivers(filterRivers.filter((river) => activeFilters.some((filter) => river.name == filter)))

    // Fetch filtered data for the selected waste dumps and trigger the download on success
    useQuery('filteredData', () => fetchMultipleWasteById(data.filter(item => isFitForFilters(item, activeFilters, selectedTime,filteredRivers)).map(item => item.id)),
        { enabled: shouldFetch, onSuccess: (fetchedData) => { downloadData(fetchedData, t); setShouldFetch(false); } });

    const downloadHandler = () => {
        setShouldFetch(true);
    }

    return (
        <button className='btn download-button' onClick={downloadHandler}>
            <span className='material-symbols-outlined' >
                download
            </span>
            <div id='download-button-text'>
                <Trans i18nKey="filter_names.download_btn_text"></Trans>
            </div>
        </button>
    );
}

export default DownloadButton;
