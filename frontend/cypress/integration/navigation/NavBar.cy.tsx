import i18n from 'i18next';
import mount  from '../utils.cy';
import NavBar from 'components/Navigation/NavBar';

/**
 * @description Test suite for NavBar component.
 */
describe('NavBar', () => {
    // Test the navigation bar on a large screen
    context('1028x720 screen', () => {
        beforeEach(() => {
            cy.viewport(1028, 720);
            mount(<NavBar i18n={i18n} />);
        });

        it('renders the navigation bar', () => {
            cy.get('#nav-bar').should('be.visible');
        });

        it('renders the logo', () => {
            cy.get('.main-logo').should('be.visible');
        });

        it('navigates to the home page when the logo is clicked', () => {
            cy.get('.main-logo').click();
            cy.url().should('eq', `${Cypress.config().baseUrl}/`);
        });

        it('Expand button is not visible', () => {
            cy.get('#nav-expand-btn').should('not.be.visible');
        });

        it('navigates to the correct page when a navigation link is clicked', () => {
            cy.get(':nth-child(2) > a').click();
            cy.url().should('include', '/contact');
        });
    });
    
    // Since the navigation bar is responsive, test it on a smaller screen
    context('500x500 screen', () => {
        beforeEach(() => {
            cy.viewport(500, 500);
            mount(<NavBar i18n={i18n} />);
        });

        it('Expand button is  visible', () => {
            cy.get('#nav-expand-btn').should('be.visible');
        });

        it('navigation menu appears when the open button is clicked', () => {
            cy.get('#nav-expand-btn').click();
            cy.get('ul.expanded-nav').should('be.visible');
        });
        
        it('navigates to the correct page when a navigation link is clicked', () => {
            cy.get('#nav-expand-btn').click();
            cy.get(':nth-child(2) > a').click();
            cy.url().should('include', '/contact');

            cy.get('#nav-expand-btn').click();
            cy.get(':nth-child(3) > a').click();
            cy.url().should('include', '/about');
        });
    });
});