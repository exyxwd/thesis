import mount from '../utils.cy';
import UserEditor from 'components/Dashboard/UserEditor';

/**
 * @description Test suite for UserEditor component.
 */
describe('UserEditor', () => {
    beforeEach(() => {
        // Intercept the users fetch API call and mock a successful response with test username
        cy.intercept('GET', '/api/auth/users', [
            { username: 'testUser1' }, { username: 'testUser2' }
        ]).as('fetchUsers');
        mount(<UserEditor />);
        cy.wait('@fetchUsers');
    });

    it('renders successfully', () => {
        cy.get('.user-table-container').should('be.visible');
    });

    it('opens the user editor dropdown when a user row is clicked', () => {
        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu').should('be.visible');
    });

    it('password change modal appears on change password click', () => {
        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(1)').click();
        cy.get('.modal').should('be.visible');
    });

    it('password change modal exit button works', () => {
        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(1)').click();
        cy.get('.modal-footer > .btn-secondary').click();
        cy.get('.modal').should('not.exist');
    });

    it('password change request is sent', () => {
        cy.intercept('PUT', '/api/auth/users/*/password', (req) => {
            expect(req.body).to.deep.equal({ newPassword: 'newpassword' });
        }).as('passwordChange');

        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(1)').click();
        cy.get('.form-control').type('newpassword');
        cy.get('.btn-primary').click();

        cy.wait('@passwordChange').then((interception) => {
            assert.isNotNull(interception.response, 'API call has been made');
        });
    });

    it('username change modal appears on change username click', () => {
        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(2)').click();
        cy.get('.modal').should('be.visible');
    });

    it('username change modal exit button works', () => {
        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(2)').click();
        cy.get('.modal-footer > .btn-secondary').click();
        cy.get('.modal').should('not.exist');
    });

    it('username change request is sent', () => {
        cy.intercept('PUT', '/api/auth/users/*/username', (req) => {
            expect(req.body).to.deep.equal({ newUsername: 'newUsername' });
        }).as('usernameChange');

        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(2)').click();
        cy.get('.form-control').type('newUsername');
        cy.get('.btn-primary').click();

        cy.wait('@usernameChange').then((interception) => {
            assert.isNotNull(interception.response, 'API call has been made');
        });
    });

    it('delete modal appears on delete user click', () => {
        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(3)').click();
        cy.get('.modal').should('be.visible');
    });

    it('delete modal exit button works', () => {
        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(3)').click();
        cy.get('.modal-footer > .btn-secondary').click();
        cy.get('.modal').should('not.exist');
    });

    it('delete request is sent', () => {
        cy.intercept('DELETE', '/api/auth/users/*/delete').as('deleteUser');

        cy.get(':nth-child(1) > :nth-child(2) > .dropdown > #dropdown-basic').click();
        cy.get('.dropdown-menu > :nth-child(3)').click();
        cy.get('.btn-danger').click();

        cy.wait('@deleteUser').then((interception) => {
            assert.isNotNull(interception.response, 'API call has been made');
        });
    });
});