import mount from '../utils.cy';
import DownloadButton from 'components/Main/DownloadButton';
import { MinimalTrashData, TrashCountry, TrashSize, TrashStatus } from 'models/models';

/**
 * Test suite for the DownloadButton component.
 */
describe('DownloadButton', () => {
    beforeEach(() => {
        const selectedWastes: MinimalTrashData[] = [
            {
                id: 1,
                latitude: 0,
                longitude: 0,
                country: TrashCountry.Hungary,
                size: TrashSize.Car,
                status: TrashStatus.StillHere,
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