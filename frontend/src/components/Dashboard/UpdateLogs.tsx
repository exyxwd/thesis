import { Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { UpdateLog } from 'models/models';
import { deleteLogs, fetchUpdateLogs } from 'API/queryUtils';

const UpdateLogs: React.FC = () => {
    const { data: logs, isLoading, error, refetch } = useQuery<UpdateLog[]>('updateLogs', fetchUpdateLogs);
    const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
    const deleteMutation = useMutation(deleteLogs);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedLogs(event.target.checked ? logs?.map(log => log.id) || [] : []);
    };

    const handleSelectLog = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedLogs(prevSelectedLogs => event.target.checked ? [...prevSelectedLogs, id] : prevSelectedLogs.filter(logId => logId !== id));
    };

    const handleDeleteSelected = async () => {
        if (!selectedLogs.length) return;
        deleteMutation.mutate(selectedLogs, {
            onSuccess: () => {
                setSelectedLogs([]);
                refetch();
            }
        });
    };

    if (isLoading) return <div className='loader'></div>;

    if (error) return <div>Error loading data</div>;

    return (
        <div className='logs-table-container'>
            <table className='logs-table table-striped'>
                <thead>
                    <tr className='log-table-head text-center'>
                        <th>
                            <Form.Check className='delete-checkbox' type='checkbox' onChange={handleSelectAll} checked={logs?.length === selectedLogs.length} />
                        </th>
                        <th>Update Time</th>
                        <th>Update Count</th>
                        <th>Delete Count</th>
                        <th>Total Count</th>
                    </tr>
                </thead>
                <tbody>
                    {logs?.map(log => {
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
                            <span className={`material-symbols-outlined delete-icon ${selectedLogs.length === 0 && 'no-log-selected'}`}
                                onClick={handleDeleteSelected}>delete</span>
                        </td>
                        <td className='fw-bold' colSpan={3}>Frissítések száma: {logs?.length}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UpdateLogs;