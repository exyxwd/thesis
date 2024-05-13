import mount from '../utils.cy';
import Pagination from 'components/Dashboard/Pagination';

/** @constant {number} totalRecords - The number used in the tests as the total number of records. */
const totalRecords = 100;
/** @constant {number} recordsPerPage - The number used in the tests as the maximum number of records to be displayed on one page. */
const recordsPerPage = 10;
/** @constant {number} totalPages - Total number of pages. */
const totalPages = Math.ceil(totalRecords / recordsPerPage);

/**
 * @description Test suite is for the Pagination component.
 */
describe('Pagination', () => {
    beforeEach(() => {
        /** @constant {number} handlePageChange - Dummy function that triggers on page click. */
        const handlePageChange = cy.stub();
        mount(<Pagination totalRecords={totalRecords} recordsPerPage={recordsPerPage} handlePageChange={handlePageChange} />);
    });

    it('renders successfully', () => {
        cy.get('.pagination').should('exist');
    });

    it('disables the previous page and backward to first page button on the first page', () => {
        cy.get('.pagination .page-item:nth-child(2)').should('have.class', 'disabled');
        cy.get('.pagination .page-item:first').should('have.class', 'disabled');
    });

    it('enables the next page and forward to last page button on the first page', () => {
        cy.get('.pagination .page-item:nth-last-child(2)').should('not.have.class', 'disabled');
        cy.get('.pagination .page-item:last').should('not.have.class', 'disabled');
    });

    it('navigates to the last page when the forward to last page button is clicked', () => {
        cy.get('.pagination .page-item:last').click();
        cy.get('.pagination .page-item:nth-last-child(3)').should('contain', totalPages);
    });

    it('navigates to the first page when the backward to first page button is clicked', () => {
        cy.get('.pagination .page-item:last').click();
        cy.get('.pagination .page-item:first').click();
        cy.get('.pagination .page-item:nth-child(3)').should('contain', '1');
    });

    it("highlights the second page's button when navigating from the first page with the next page button", () => {
        cy.get('.pagination .page-item:nth-child(3)').should('not.have.class', 'disabled');
        cy.get('.pagination .page-item:nth-last-child(2)').click();
        cy.get('.pagination .page-item.active .page-link').should('contain', '2');
    });

    it("highlights the first page's button when navigating from the second page with the previous page button", () => {
        cy.get('.pagination .page-item:nth-last-child(2)').click();
        cy.get('.pagination .page-item:nth-child(2)').click();
        cy.get('.pagination .page-item.active .page-link').should('contain', '1');
    });
});