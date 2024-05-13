/**
 * @description Test suite for the main page.
 */
describe('Main Page', () => {
    // Test the main page on small and big screen sizes
    const sizes = [[500, 500], [1024, 768]];
    sizes.forEach((size) => {
        context(`${size[0]}x${size[1]} screen`, () => {
            before(() => {
                // Intercept the request for the map data to make sure the map is loaded before the tests
                cy.intercept('GET', '/api/wastes/mapDataFiltered').as('fetchMapDataFiltered');
                cy.visit('/');
                cy.wait('@fetchMapDataFiltered');
            });

            beforeEach(() => {
                // Resize the window to the currently tested size
                cy.viewport(size[0], size[1]);
            });

            it('map is visible', () => {
                cy.get('#map').should('be.visible');
            });

            it('navigation bar is visible', () => {
                cy.get('#nav-bar').should('be.visible');
            });

            it('filter menu is visible on filter button click', () => {
                cy.get('.filter-button').click();
                cy.get('#filter-menu').should('be.visible');
            });
            
            it('filter menu is not visible on filter menu close', () => {
                cy.get('.filter-button').click();
                cy.get('#filter-menu').should('not.be.visible');
            });

            it('filter menu item click selects item', () => {
                cy.get('.filter-button').click();
                cy.get(':nth-child(4) > .row-cols-auto > :nth-child(2) > .filter-item').click();
                cy.get(':nth-child(4) > .row-cols-auto > :nth-child(2) > .filter-item').should('have.class', 'selected');
            });

            it('filter menu item click on selected item unselects item', () => {
                cy.get(':nth-child(4) > .row-cols-auto > :nth-child(2) > .filter-item').click();
                cy.get(':nth-child(4) > .row-cols-auto > :nth-child(2) > .filter-item').should('not.have.class', 'selected');
            });

            it('download button is visible', () => {
                cy.get('.filter-container').scrollTo('top');
                cy.get('.download-button').should('be.visible');
            });

            it('click on download button triggers request for download data', () => {
                cy.intercept('POST', '/api/wastes/filteredWastes').as('fetchData');
                cy.get('.download-button').click();
                cy.wait('@fetchData');
            });

            it('waste panel opens on marker click', () => {
                const clickMarkerUntilPanelAppears = (counter = 0) => {
                    if (counter === 10) {
                        return;
                    }

                    cy.get('.leaflet-marker-icon').first().click({ force: true });

                    cy.get('body').then($body => {
                        if ($body.find('#waste-panel').length === 0) {
                            cy.wait(1000);
                            clickMarkerUntilPanelAppears(counter + 1);
                        }
                    });
                };

                clickMarkerUntilPanelAppears();
                cy.get('#waste-panel').should('be.visible');
            });

            it('waste panel closes on close button click', () => {
                cy.get('.waste-panel-close-btn').click();
                cy.get('#waste-panel').should('not.exist');
            });
        });
    });
});