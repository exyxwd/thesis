import mount from '../utils.cy';
import UpdateLogs from 'components/Dashboard/UpdateLogs';

// Mock update logs data
const mockData = [
    { id: 1, updateTime: new Date().toISOString(), updateCount: 10, deleteCount: 5, totalCount: 15 },
    { id: 2, updateTime: new Date().toISOString(), updateCount: 20, deleteCount: 10, totalCount: 30 }
];

/**
 * @description Test suite for UpdateLogs component.
*/
describe('UpdateLogs', () => {
    beforeEach(() => {
        // Intercept the logs fetch API call and mock a successful response with test data
        cy.intercept('GET', '/api/logs', mockData).as('fetchLogs');
        mount(<UpdateLogs />);
        cy.wait('@fetchLogs');
    });

    it('renders successfully', () => {
        cy.get('.logs-table-container').should('be.visible');
    });

    it('checks all log checkboxes when select all is checked', () => {
        cy.get('.log-table-row').each(($el) => {
            cy.wrap($el).should('be.visible');
        });

        cy.get('.delete-checkbox').find(':checkbox:first').check();

        cy.get('.log-table-row').each(($el) => {
            cy.wrap($el).find('.delete-checkbox').find(':checkbox:first').should('be.checked');
        });
    });

    it('unselects all logs when the checked select all is unchecked', () => {
        cy.get('.log-table-row').each(($el) => {
            cy.wrap($el).should('be.visible');
        });

        cy.get('.delete-checkbox').find(':checkbox:first').check();
        cy.get('.delete-checkbox').find(':checkbox:first').uncheck();

        cy.get('.log-table-row').each(($el) => {
            cy.wrap($el).find('.delete-checkbox').find(':checkbox:first').should('not.be.checked');
        });
    });

    it('selects a log when its checkbox is checked', () => {
        cy.get('.delete-checkbox').find(':checkbox:first').eq(1).check();
        cy.get('.delete-checkbox').find(':checkbox:first').eq(1).should('be.checked');
    });

    it('displays the correct data and calculates the update count correctly', () => {
        // Check if the data is displayed correctly
        mockData.reverse().forEach((log, index) => {
            const updateTime = new Date(log.updateTime).toLocaleString();
            cy.get('.log-table-row').eq(index).within(() => {
                cy.get('td').eq(1).should('contain', updateTime);
                cy.get('td').eq(2).should('contain', log.updateCount);
                cy.get('td').eq(3).should('contain', log.deleteCount);
                cy.get('td').eq(4).should('contain', log.totalCount);
            });
        });

        // Check update count calculation
        cy.get('.logs-table-container').find('tr.sticky-bottom').within(() => {
            cy.get('td').eq(1).should('contain', `${mockData.length}`);
        });
    });

    it('sends delete request when delete selected is clicked', () => {
        const idsToDelete = [1];

        cy.intercept('DELETE', '/api/logs', (req) => {
            expect(req.body).to.deep.equal(idsToDelete);
        }).as('deleteLogs');

        cy.get(':nth-child(1) > .px-4 > .delete-checkbox > .form-check-input').click();
        cy.get('.material-symbols-outlined.delete-icon').click();
        cy.wait('@deleteLogs');
    });
});