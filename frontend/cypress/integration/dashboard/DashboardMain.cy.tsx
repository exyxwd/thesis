import mount from '../utils.cy';
import DashboardMain from 'components/Dashboard/DashboardMain';

/**
 * @description Test suite for DashboardMain component
 */
describe('DashboardMain', () => {
    it('renders successfully', () => {
        mount(<DashboardMain />);
        cy.get('.background-logo').should('be.visible');
    });
});