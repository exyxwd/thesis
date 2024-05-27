import { Trans } from 'react-i18next';
import { Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import Pagination from './Pagination';
import { NotificationType, UpdateLog } from 'models/models';
import { deleteLogs, fetchUpdateLogs } from 'API/queryUtils';
import { useShowNotification } from 'components/Main/NotificationContext';

/**
 * Component for displaying the update logs
 *
 * @returns {React.ReactElement} The update logs table
 */
const UpdateLogs: React.FC = (): React.ReactElement => {
    const recordsPerPage = 40;
    const deleteMutation = useMutation(deleteLogs);
    const [logs, setLogs] = useState<UpdateLog[]>([]);
    const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
    const [indexOfFirstRecord, setIndexOfFirstRecord] = React.useState<number>(0);
    const [indexOfLastRecord, setIndexOfLastRecord] = React.useState<number>(recordsPerPage);
    const currentRecords = logs.slice(indexOfFirstRecord, indexOfLastRecord);
    const showNotification = useShowNotification();

    const { isFetching, isLoading, error, refetch } = useQuery<UpdateLog[]>('updateLogs', fetchUpdateLogs,
        {
            enabled: false,
            onSuccess: (data) => {
                setLogs(data.reverse());
            },
            onError: () => {
                showNotification(NotificationType.Error, 'update_logs_error');
            }
        });

    useEffect(() => {
        refetch();
    }, [refetch]);

    // Handle the selection of all logs on the current page
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedLogs(event.target.checked ? currentRecords.map(log => log.id) || [] : []);
    };

    // Handle the selection of one log
    const handleSelectLog = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedLogs(prevSelectedLogs => event.target.checked ? [...prevSelectedLogs, id] : prevSelectedLogs.filter(logId => logId !== id));
    };

    // Handle the deletion of selected logs by triggering the delete mutation
    const handleDeleteSelected = async () => {
        if (!selectedLogs.length) return;
        deleteMutation.mutate(selectedLogs, {
            onSuccess: () => {
                showNotification(NotificationType.Success, 'delete_log_success');
                setSelectedLogs([]);
                refetch();
            },
            onError: () => {
                showNotification(NotificationType.Error, 'delete_log_error');
            }
        });
    };

    const handlePageChange = (indexOfFirstRecord: number, indexOfLastRecord: number) => {
        setIndexOfLastRecord(indexOfLastRecord);
        setIndexOfFirstRecord(indexOfFirstRecord);
        setSelectedLogs([]);
    };

    if (isLoading) return <div className='admin-loader'></div>;

    if (error) return <div></div>;

    return (
        <div className='logs-table-container'>
            <table className='logs-table table-striped'>
                <thead>
                    <tr className='log-table-head text-center sticky-top'>
                        <th>
                            <Form.Check className='delete-checkbox' type='checkbox' onChange={handleSelectAll} checked={currentRecords.length === selectedLogs.length} />
                        </th>
                        <th><Trans i18nKey='logs.update-time'>Frissítés ideje</Trans></th>
                        <th><Trans i18nKey='logs.update-count'>Frissítettek száma</Trans></th>
                        <th><Trans i18nKey='logs.delete-count'>Töröltek száma</Trans></th>
                        <th><Trans i18nKey='logs.total-count'>Összesen</Trans></th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map(log => {
                        const updateTime = new Date(log.updateTime);
                        const formattedTime = updateTime.toLocaleString();
                        return (
                            <tr key={log.id} className='log-table-row text-center'>
                                <td className='px-4'>
                                    <Form.Check type='checkbox' className='delete-checkbox'
                                        onChange={handleSelectLog(log.id)} checked={selectedLogs.includes(log.id)} />
                                </td>
                                <td>{formattedTime}</td>
                                <td className='text-success fw-bold'>{log.updateCount}</td>
                                <td className='text-danger fw-bold'>{log.deleteCount}</td>
                                <td className='fw-bold'>{log.totalCount}</td>
                            </tr>
                        );
                    })}
                    <tr className='text-center sticky-bottom'>
                        <td>
                            {(isFetching || deleteMutation.isLoading) ?
                                <span className="material-symbols-outlined loading-icon">progress_activity</span>
                                :
                                <span className={`material-symbols-outlined delete-icon ${selectedLogs.length === 0 && 'disabled-delete-icon'}`}
                                    onClick={handleDeleteSelected}>delete</span>
                            }
                        </td>
                        <td className='fw-bold' colSpan={3}><Trans i18nKey='logs.update-num'>Frissítések száma</Trans>: {logs.length}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            {Math.ceil(logs.length / recordsPerPage) > 1 && (
                <Pagination
                    totalRecords={logs.length}
                    recordsPerPage={recordsPerPage}
                    handlePageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default UpdateLogs;