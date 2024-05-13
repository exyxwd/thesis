/**
 * @description Test suite for the Dashboard.
*/
describe('Dashboard', () => {

    before(() => {
        // Intercept the request to fetch the user info and mock a 403 response to simulate the user not being logged in
        cy.intercept({
            method: 'GET',
            url: '/api/auth/userInfo',
        }, { statusCode: 403 }
        ).as('getUserInfo');
        cy.visit('/dashboard');
        cy.wait('@getUserInfo');
    });

    it('sidebar does not appear when the user is not logged in', () => {
        cy.get('.dashboard-sidebar').should('not.exist');
    });

    it('navigation bar is visible', () => {
        cy.get('#nav-bar').should('be.visible');
    });

    it('logs in user on correct credentials', () => {
        // Intercept the login API call and mock a succesful login response to simulate a successful login
        cy.intercept({
            method: 'POST',
            url: '/api/auth/login',
        }, { statusCode: 200 }
        ).as('postLogin');

        cy.get('input[id="username"]').type('testUser').should('have.value', 'testUser');
        cy.get('input[id="password"]').type('testUser').should('have.value', 'testUser');

        // Intercept the login API call and mock a succesful user info response to simulate a logged in user
        cy.intercept({
            method: 'GET',
            url: '/api/auth/userInfo',
        }, {
            body: {
                username: 'testUser'
            },
            statusCode: 200
        }).as('getUserInfo');

        cy.get('button[type="submit"]').click();

        cy.wait('@postLogin');
        cy.get('.dashboard-sidebar').should('be.visible');
    });

    it('navigates to different pages', () => {
        cy.get('.menu-item').filter('[href="/dashboard"]').click();
        cy.url().should('include', '/dashboard');

        cy.get('.menu-item').filter('[href="/dashboard/register"]').click();
        cy.url().should('include', '/dashboard/register');

        cy.get('.menu-item').filter('[href="/dashboard/users"]').click();
        cy.url().should('include', '/dashboard/users');

        cy.get('.menu-item').filter('[href="/dashboard/hiddens"]').click();
        cy.url().should('include', '/dashboard/hiddens');

        cy.get('.menu-item').filter('[href="/dashboard/logs"]').click();
        cy.url().should('include', '/dashboard/logs');
    });

    it('logs out user on logout button click', () => {
        cy.intercept({
            method: 'POST',
            url: '/api/auth/logout',
        }, { statusCode: 200 }
        ).as('postLogout');
        cy.get('.logout-btn').click();
        cy.wait('@postLogout');
        cy.get('.dashboard-sidebar').should('not.exist');
    });
});