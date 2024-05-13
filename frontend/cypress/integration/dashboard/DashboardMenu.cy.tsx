import mount from '../utils.cy';
import DashboardMenu from 'components/Dashboard/DashboardMenu';

/**
 * @description Test suite is for the DashboardMenu component.
 */
describe('DashboardMenu', () => {
    beforeEach(() => {
        // Intercept the fetchUserinfo API call and mock a succesful response with a username for testing
        cy.intercept('GET', '/api/auth/userInfo', {
            body: {
                username: 'testUser'
            },
            statusCode: 200
        }).as('fetchUserinfo');
        mount(<DashboardMenu />);
    });

    // Test on a 1024x768 screen
    context('1024x768 screen', () => {
        beforeEach(() => {
            cy.viewport(1024, 768);
        });

        it('toggle button not visible', () => {
            cy.get('.menu-toggle').should('not.be.visible');
        });

        it('menu is visible', () => {
            cy.get('.dashboard-sidebar').should('be.visible');
        });

        it('navigates to different pages', () => {
            cy.get('.menu-item').filter('[href="/dashboard"]').click();
            cy.url().should('include', '/dashboard');

            cy.get('.menu-item').filter('[href="/dashboard/register"]').click();
            cy.url().should('include', '/dashboard/register');

            cy.get('.menu-item').filter('[href="/dashboard/users"]').click();
            cy.url().should('include', '/dashboard/users');

            cy.get('.menu-item').filter('[href="/dashboard/logs"]').click();
            cy.url().should('include', '/dashboard/logs');

            cy.get('.menu-item').filter('[href="/dashboard/hiddens"]').click();
            cy.url().should('include', '/dashboard/hiddens');
        });

        it('displays the correct username', () => {
            cy.wait('@fetchUserinfo');
            cy.get('.user-name').should('contain', 'testUser');
        });

        it('logs out', () => {
            cy.intercept('POST', '/api/auth/logout').as('logoutCheck');
            cy.get('.logout-btn').click();
            cy.wait('@logoutCheck').its('request.url').should('include', '/api/auth/logout');
        });
    });

    // Since the menu is responsive, it is hidden by default on smaller screens and can opened and closed with the toggle button
    context('500x500 screen', () => {
        beforeEach(() => {
            cy.viewport(500, 500);
        });

        it('not visible by default', () => {
            cy.get('.dashboard-menu-area').should('not.be.visible');
        });

        it('toggle button visible', () => {
            cy.get('.menu-toggle').should('be.visible');
        });

        it('opens and closes the menu', () => {
            cy.get('.menu-toggle').click();
            cy.get('.dashboard-sidebar.is-active').should('be.visible');

            cy.get('.menu-toggle').click();
            cy.get('.dashboard-sidebar.is-active').should('not.exist');
        });

        it('navigates to different pages', () => {
            cy.get('.menu-toggle').click();
            cy.get('.menu-item').filter('[href="/dashboard"]').click();
            cy.url().should('include', '/dashboard');

            cy.get('.menu-toggle').click();
            cy.get('.menu-item').filter('[href="/dashboard/register"]').click();
            cy.url().should('include', '/dashboard/register');

            cy.get('.menu-toggle').click();
            cy.get('.menu-item').filter('[href="/dashboard/users"]').click();
            cy.url().should('include', '/dashboard/users');

            cy.get('.menu-toggle').click();
            cy.get('.menu-item').filter('[href="/dashboard/logs"]').click();
            cy.url().should('include', '/dashboard/logs');

            cy.get('.menu-toggle').click();
            cy.get('.menu-item').filter('[href="/dashboard/hiddens"]').click();
            cy.url().should('include', '/dashboard/hiddens');
        });

        it('logs out', () => {
            cy.intercept('POST', '/api/auth/logout').as('logoutCheck');
            cy.get('.menu-toggle').click();
            cy.get('.logout-btn').click();
            cy.wait('@logoutCheck').its('request.url').should('include', '/api/auth/logout');
        });
    });
});