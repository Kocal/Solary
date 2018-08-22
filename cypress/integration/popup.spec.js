describe('Popup', () => {
  before(() => {
    cy.viewport(800, 400);
    cy.visit('http://localhost:5000/popup/popup.html');
  });

  it('should renders', () => {
    cy.get('body').should('not.empty');
  });
});
