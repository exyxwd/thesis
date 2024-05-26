import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';

import { fetchHiddenWastes, hideWaste } from 'API/queryUtils';
import { useShowNotification } from 'components/Main/NotificationContext';
import { ExpandedWasteData, NotificationType } from 'models/models';
import Pagination from './Pagination';

const HiddenWastes: React.FC = () => {
    const recordsPerPage = 16;
    const [hiddenWastes, setHiddenWastes] = useState<ExpandedWasteData[]>([]);
    const [indexOfFirstRecord, setIndexOfFirstRecord] = React.useState<number>(0);
    const [indexOfLastRecord, setIndexOfLastRecord] = React.useState<number>(recordsPerPage);
    const currentRecords = hiddenWastes.slice(indexOfFirstRecord, indexOfLastRecord);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const showNotification = useShowNotification();
    const { t } = useTranslation();

    const { isFetching, isLoading, error, refetch } = useQuery<ExpandedWasteData[]>('fetchHiddenWastes', fetchHiddenWastes, {
        enabled: false,
        onSuccess: (data) => {
            setHiddenWastes(data);
            setLoadingId(null);
        },
        onError: () => {
            showNotification(NotificationType.Error, 'fetch_hidden_wastes_error');
            setLoadingId(null);
        },
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const hideWasteMutation = useMutation(({ id, hiddenStatus }: { id: number; hiddenStatus: boolean }) => {
        setLoadingId(id);
        return hideWaste(id, hiddenStatus);
    }, {
        onSuccess: () => {
            showNotification(NotificationType.Success, 'unhide_waste_success');
            refetch();
        },
        onError: () => {
            showNotification(NotificationType.Error, 'unhide_waste_error');
        },
    });

    const handleHideWaste = (id: number) => {
        hideWasteMutation.mutate({ id, hiddenStatus: false });

        if (currentRecords.length === 1 && indexOfFirstRecord !== 0) {
            const newIndexOfLastRecord = indexOfFirstRecord;
            const newIndexOfFirstRecord = newIndexOfLastRecord - recordsPerPage;

            setIndexOfLastRecord(newIndexOfLastRecord);
            setIndexOfFirstRecord(newIndexOfFirstRecord);
        }
    };

    const handlePageChange = (indexOfFirstRecord: number, indexOfLastRecord: number) => {
        setIndexOfLastRecord(indexOfLastRecord);
        setIndexOfFirstRecord(indexOfFirstRecord);
    };

    if (isLoading) return <div className='admin-loader'></div>;

    if (error) return <div></div>;

    return (
        <div id='hidden-wastes'>
            <Row className='p-4 m-0'>
                {currentRecords.map(log => (
                    <Col sm={6} md={4} lg={3} key={log.id}>
                        <Card key={log.id} className='mb-4'>
                            <Card.Body className='text-center p-0 mt-2'>
                                <Card.Title className="mt-3"><Trans i18nKey='hiddens.location'>Pont</Trans>&nbsp;#{log.id}</Card.Title>
                                <Card.Text>{log.locality}</Card.Text>
                                <Card.Text>
                                    <strong><Trans i18nKey='hiddens.updated'>Frissítve:</Trans>&nbsp;</strong>
                                    {new Date(log.updateTime).toLocaleDateString()}
                                </Card.Text>
                                <Card.Link href={`/waste/${log.id}`} target="_blank"
                                    rel="noopener noreferrer" className="position-absolute top-0 end-0 p-2">
                                    <span className="material-symbols-outlined open-in-new-icon">open_in_new</span>
                                </Card.Link>
                                <Card.Footer className="d-flex justify-content-center align-items-center">
                                    {loadingId === log.id ?
                                        <span className="material-symbols-outlined loading-icon">progress_activity</span>
                                        :
                                        <span className={`material-symbols-outlined hide-btn ${loadingId !== null && 'disabled-hide-btn'}`}
                                            title={`${t('hiddens.unhide')}`}
                                            onClick={() => {
                                                if (loadingId === null) {
                                                    handleHideWaste(log.id);
                                                }
                                            }}>
                                            visibility
                                        </span>
                                    }
                                </Card.Footer>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                <div className='d-flex justify-content-center align-items-center mt-5'>
                    {currentRecords.length === 0 && !(isFetching || isLoading) &&
                        <div className='no-data d-flex flex-column justify-content-center align-items-center'>
                            <span className="material-symbols-outlined loading-error-icon">
                                location_off
                            </span>
                            <p className="fw-bold"><Trans i18nKey='hiddens.no_data'>Nincsenek még rejtett pontok.</Trans></p>
                        </div>
                    }
                </div>
            </Row>
            {Math.ceil(hiddenWastes.length / recordsPerPage) > 1 && (
                <Pagination
                    totalRecords={hiddenWastes.length}
                    recordsPerPage={recordsPerPage}
                    handlePageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default HiddenWastes;