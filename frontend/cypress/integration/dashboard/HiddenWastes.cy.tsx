import mount from '../utils.cy';
import HiddenWastes from 'components/Dashboard/HiddenWastes';

/** @constant {number} mock_id - The id of the hidden waste. */
const mock_id = 7;

/** @constant {string} mock_locality - The locality of the hidden waste. */
const mock_locality = 'Locality no. x';

/**
 * @description Test suite is for the HiddenWastes component.
 */
describe('HiddenWastes', () => {
    context('with mocked data', () => {
        beforeEach(() => {
            const mockData = [{ id: mock_id, locality: mock_locality, updateTime: new Date().toISOString() }];
            cy.intercept('GET', '/api/wastes/hidden', mockData);

            mount(<HiddenWastes />);
        });

        it('displays hidden wastes after successful fetch', () => {
            cy.get('.card').should('be.visible');
        });

        it('displays the correct data in the cards', () => {
            cy.get('.card').first().within(() => {
                cy.get('.card-title').should('contain', '#' + mock_id);
                cy.get('.card-text').should('contain', mock_locality);
            });
        });

        it('sends unhide request when the unhide button is clicked', () => {
            cy.intercept({
                method: 'PUT',
                url: `/api/wastes/${mock_id}/hidden`,
            }).as('unhideWaste');

            cy.get('.hide-btn').first().click();
            cy.wait('@unhideWaste')
                .its('request.body')
                .should('have.property', 'hidden', false);
        });
    });

    context('with empty ocked data', () => {
        beforeEach(() => {
            cy.intercept('GET', '/api/wastes/hidden', []);
            mount(<HiddenWastes />);
        });

        it('displays no hidden wastes message when there are no wastes', () => {
            cy.get('.no-data').should('be.visible');
        });
    });
});