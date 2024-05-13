import mount from '../utils.cy';
import Login from 'components/Dashboard/Login';

/** @constant {string} input - The string used in the tests as username and password. */
const input = "test";

/**
 * @description Test suite is for the Login component.
 */
describe('Login', () => {
    beforeEach(() => {
        // Intercept the login API call and mock an unsuccesful response
        cy.intercept({
            method: 'POST',
            url: '/api/auth/login',
        }, {
            statusCode: 401
        });

        mount(<Login />);
    });

    it('renders successfully', () => {
        cy.get('.container').should('be.visible');
    });

    it('accepts input', () => {
        cy.get('input[id="username"]').type(input).should('have.value', input);
        cy.get('input[id="password"]').type(input).should('have.value', input);
    });

    it('shows error message on invalid credentials', () => {
        cy.get('input[id="username"]').type(input).should('have.value', input);
        cy.get('input[id="password"]').type(input).should('have.value', input);
        cy.get('button[type="submit"]').click();
        cy.get('.invalid-creds-text').should('exist');
    });

    it('shows HTML5 validation message when username is missing on submit', () => {
        cy.get('input[id="password"]').type(input).should('have.value', input);
        cy.get('button[type="submit"]').click();
        cy.get('input[id="username"]:invalid').should('exist');
    });

    it('shows HTML5 validation message when password is missing on submit', () => {
        cy.get('input[id="username"]').type(input).should('have.value', input);
        cy.get('button[type="submit"]').click();
        cy.get('input[id="password"]:invalid').should('exist');
    });

    it('does not show error message on valid credentials', () => {
        // Intercept the login API call and mock a succesful response
        cy.intercept({
            method: 'POST',
            url: '/api/auth/login',
        }, {
            statusCode: 200
        });

        cy.get('input[id="username"]').type(input).should('have.value', input);
        cy.get('input[id="password"]').type(input).should('have.value', input);
        cy.get('button[type="submit"]').click();
        cy.get('.invalid-creds-text').should('not.exist');
    });
});