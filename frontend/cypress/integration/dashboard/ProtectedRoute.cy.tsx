import mount from '../utils.cy';
import ProtectedRoute from 'components/Dashboard/ProtectedRoute';

/**
 * @description Test suite for ProtectedRoute component
 */
describe('ProtectedRoute', () => {
    it('redirects to login if not authenticated', () => {
        mount(<ProtectedRoute />);
        cy.url().should('include', '/dashboard/login');
    });
});