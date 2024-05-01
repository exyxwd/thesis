import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';

import { ExpandedTrashData } from 'models/models';
import { fetchHiddenWastes, hideWaste } from 'API/queryUtils';
import Pagination from './Pagination';
import { Trans, useTranslation } from 'react-i18next';

const HiddenWastes: React.FC = () => {
    const recordsPerPage = 16;
    const [hiddenWastes, setHiddenWastes] = useState<ExpandedTrashData[]>([]);
    const [indexOfFirstRecord, setIndexOfFirstRecord] = React.useState<number>(0);
    const [indexOfLastRecord, setIndexOfLastRecord] = React.useState<number>(recordsPerPage);
    const currentRecords = hiddenWastes.slice(indexOfFirstRecord, indexOfLastRecord);
    const { t } = useTranslation();

    const { isLoading, error, refetch } = useQuery<ExpandedTrashData[]>('fetchHiddenWastes', fetchHiddenWastes, {
        onSuccess: (data) => {
            setHiddenWastes(data);
        },
    });

    const hideWasteMutation = useMutation(({ id, hiddenStatus }: { id: number; hiddenStatus: boolean }) => hideWaste(id, hiddenStatus), {
        onSuccess: () => {
            refetch();
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

    if (isLoading) return <div className='loader'></div>;

    if (error) return <div>Error loading data</div>;

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
                                    <span className="material-symbols-outlined hide-btn" onClick={() => handleHideWaste(log.id)} title={`${t('hiddens.unhide')}`}>
                                        visibility
                                    </span>
                                </Card.Footer>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
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