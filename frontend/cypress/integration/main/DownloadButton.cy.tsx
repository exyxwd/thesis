import DownloadButton from 'components/Main/DownloadButton';
import { MinimalWasteData, WasteCountry, WasteSize, WasteStatus } from 'models/models';
import mount from '../utils.cy';

/**
 * Test suite for the DownloadButton component.
 */
describe('DownloadButton', () => {
    beforeEach(() => {
        const selectedWastes: MinimalWasteData[] = [
            {
                id: 1,
                latitude: 0,
                longitude: 0,
                country: WasteCountry.Hungary,
                size: WasteSize.Car,
                status: WasteStatus.StillHere,
                types: [],
                river: '',
                updateTime: '',
                hidden: false
            }
        ];
        mount(<DownloadButton selectedWastes={selectedWastes} />);
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