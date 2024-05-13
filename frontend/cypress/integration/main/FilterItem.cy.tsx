import mount from '../utils.cy';
import FilterItem from 'components/Main/FilterItem';

// Count number for the filter item with test value
const count = 3;

/**
 * @description Test suite for the FilterItem component.
 */
describe('FilterItem', () => {
    const getProps = (selected: boolean) => ({
        content: 'test',
        selected: selected,
        count: count,
        OnSelect: cy.stub().as('onSelectStub'),
    });

    // Test the filter item getting selected prop with value false
    context('not selected', () => {
        beforeEach(() => {
            mount(<FilterItem {...getProps(false)} />);
        });

        it('renders the filter item', () => {
            cy.get('.filter-item').should('be.visible');
        });

        it('does not render the filter item as selected', () => {
            cy.get('.filter-item.selected').should('not.exist');
        });

        it('triggers OnSelect when clicked', () => {
            cy.get('.filter-item').click();
        
            cy.get('@onSelectStub').should('have.been.called');
        });

        it('displays the correct count', () => {
            cy.get('.filter-item-count').should('contain', count);
        });
    });

    // Test the filter item getting selected prop with value true
    context('selected', () => {
        beforeEach(() => {
            mount(<FilterItem {...getProps(true)} />);
        });

        it('renders the filter item as selected', () => {
            cy.get('.filter-item.selected').should('be.visible');
        });

        it('does not display the count', () => {
            cy.get('.filter-item-count').should('not.exist');
        });

    });
});