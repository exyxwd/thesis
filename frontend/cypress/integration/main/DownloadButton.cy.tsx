import mount from '../utils.cy';
import DownloadButton from 'components/Main/DownloadButton';

/**
 * Test suite for the DownloadButton component.
 */
describe('DownloadButton', () => {
    beforeEach(() => {
        mount(<DownloadButton />);
    });

    it('renders the download button', () => {
        cy.get('.download-button').should('be.visible');
    });

    it('triggers request for data when clicked', () => {
        cy.intercept('POST', '/api/wastes/filteredWastes').as('fetchData');
        cy.get('.download-button').click();
        cy.wait('@fetchData');
    });

    it('displays loading indicator when clicked', () => {
        cy.get('.download-button').click();
        cy.get('.download-loader').should('be.visible');
    });
});