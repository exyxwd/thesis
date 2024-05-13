import { calcRange } from 'models/functions';
import mount from '../utils.cy';
import TimeSlider from 'components/Main/TimeSlider';

/**
 * @description Test suite for the TimeSlider component.
 */
describe('TimeSlider', () => {
    beforeEach(() => {
        mount(<TimeSlider />);
    });

    it('renders the time slider', () => {
        cy.get('#time-slider').should('be.visible');
    });

    it('renders the date input', () => {
        cy.get('#date-input').should('be.visible');
    });

    it('sets the correct minimum and maximum values for the date input', () => {
        const expectedMin = new Date(calcRange().min).toISOString().split('T')[0];
        const expectedMax = new Date(calcRange().max).toISOString().split('T')[0];

        cy.get('#date-input')
            .should('have.attr', 'min', expectedMin)
            .and('have.attr', 'max', expectedMax);
    });

    it('correct time slider min value', () => {
        const expectedMin = new Date(calcRange().min).getTime();

        cy.get('#time-slider')
            .invoke('val', expectedMin)
            .trigger('change')
            .should('have.value', expectedMin.toString());
    });

    it('correct time slider max value', () => {
        const expectedMax = new Date(calcRange().max).getTime();

        cy.get('#time-slider')
            .invoke('val', expectedMax)
            .trigger('change')
            .its('0.value')
            .then((actualValue) => {
                expect(Number(actualValue)).to.be.closeTo(expectedMax, 1000);
            });
    });
});