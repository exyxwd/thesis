import React, { useState } from 'react';

/**
 * Interface for the pagination component
 *
 * @interface PaginationProps
 * @property {number} totalRecords Total number of records
 * @property {number} recordsPerPage Number of records per page
 * @property {(indexOfFirstRecord: number, indexOfLastRecord: number) => void} handlePageChange Function to handle page change,
 * returns the index of the first record and the index of the last record
 */
interface PaginationProps {
    totalRecords: number;
    recordsPerPage: number;
    handlePageChange: (indexOfFirstRecord: number, indexOfLastRecord: number) => void;
}

/**
 * Pagination component to navigate through pages
 *
 * @param {PaginationProps} param0 Total record number, records per page number and a page change handle function
 * @returns Pagination component
 */
const Pagination: React.FC<PaginationProps> = ({ totalRecords, recordsPerPage, handlePageChange }: PaginationProps) => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        const indexOfLastRecord = pageNumber * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        handlePageChange(indexOfFirstRecord, indexOfLastRecord);
    };
    return (
        <ul className="pagination justify-content-center" style={{ position: 'fixed', bottom: 0 }}>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(1)}>
                    &lt;&lt;
                </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>
                    &lt;
                </button>
            </li>
            {[...Array(totalPages)].map((_, page) => {
                if (page + 1 <= currentPage + 2 && page + 1 >= currentPage - 2) {
                    return (
                        <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageClick(page + 1)}>
                                {page + 1}
                            </button>
                        </li>
                    );
                } else if (page + 1 === currentPage + 3 || page + 1 === currentPage - 3) {
                    return (
                        <li key={page + 1} className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    );
                }
            })}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>
                    &gt;
                </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(totalPages)}>
                    &gt;&gt;
                </button>
            </li>
        </ul>
    );
};

export default Pagination;