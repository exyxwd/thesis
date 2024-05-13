import i18n from 'i18next';
import mount from '../utils.cy';
import LanguageSelector from 'components/Navigation/LanguageSelector';

/**
 * @description Test suite for LanguageSelector component.
 */
describe('LanguageSelector', () => {
    beforeEach(() => {
        mount(<LanguageSelector i18n={i18n} />);
    });

    it('renders the language selector', () => {
        cy.get('.language-selector').should('be.visible');
    });

    it('renders the current language flag', () => {
        cy.get('.language-dropdown > span').should('have.class', `fi fi-${i18n.resolvedLanguage || 'hu'}`);
    });

    it('renders the dropdown menu when the toggle is clicked', () => {
        cy.get('.language-dropdown').click();
        cy.get('.language-dropdown-menu').should('be.visible');
    });

    it('changes the language when a dropdown item is clicked', () => {
        cy.get('.language-dropdown').click();
        cy.get('.language-dropdown-menu > .dropdown-item').first().click();
        cy.get('.language-dropdown > span').should('have.class', `fi fi-${i18n.resolvedLanguage}`);
    });
});