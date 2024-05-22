import mount from '../utils.cy';
import Register from 'components/Dashboard/Register';

/** @constant {string} input - The string used in the tests as username and password. */
const input = "test";

/**
 * @description Test suite is for the Register component.
 */
describe('Register', () => {
    beforeEach(() => {
        // Intercept the login API call and mock an unsuccesful response
        cy.intercept({
            method: 'POST',
            url: '/api/auth/register',
        }, {
            statusCode: 409
        });

        mount(<Register />);
    });

    it('renders successfully', () => {
        cy.get('.container').should('be.visible');
    });

    it('accepts input', () => {
        cy.get('input[id="username"]').type(input).should('have.value', input);
        cy.get('input[id="password"]').type(input).should('have.value', input);
    });

    it('shows error message on failed register', () => {
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

    it('shows error message on incorrect input', () => {
        cy.get('input[id="username"]').type('-').should('have.value', '-');
        cy.get('input[id="password"]').type('-').should('have.value', '-');
        cy.get('button[type="submit"]').click();
        cy.get('.invalid-creds-text').should('be.visible');
    });

    it('does not show error message on valid credentials', () => {
        // Intercept the register API call and mock a successful response
        cy.intercept({
            method: 'POST',
            url: '/api/auth/register',
        }, {
            statusCode: 200
        });

        cy.get('input[id="username"]').type(input).should('have.value', input);
        cy.get('input[id="password"]').type(input).should('have.value', input);
        cy.get('button[type="submit"]').click();
        cy.get('.invalid-creds-text').should('not.exist');
    });
})