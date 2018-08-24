describe('Popup', () => {
  before(() => {
    cy.fixture('channels.json').then(channels => {
      cy.visit('/popup/popup.html', {
        onBeforeLoad(win) {
          win.chrome = win.chrome || {};
          win.chrome.runtime = {
            sendMessage(message, cb) {
              if (message.type === 'GET_CHANNELS') {
                return cb({ data: { channels } });
              }

              return cb(void 0);
            },
          };
        },
      });
    });
  });

  describe('Navigation', () => {
    describe('Tabs', () => {
      it('Should be on "Stream" page by default', () => {
        cy.hash().should('eq', '#/streams');
        cy.get('.page-streams').should('visible');
      });

      it('Should switch on "Scheduling" page', () => {
        cy.get('[data-testid="navigation-scheduling"]').click();
        cy.hash().should('eq', '#/scheduling');
        cy.get('.page-scheduling').should('visible');
      });

      it('Should switch on "Stream" page', () => {
        cy.get('[data-testid="navigation-stream"]').click();
        cy.hash().should('eq', '#/streams');
        cy.get('.page-streams').should('visible');
      });
    });

    describe('Socials', () => {
      it('Should renders socials networks', () => {
        cy.get('[data-testid="socials-twitter"]').should('have.attr', 'href', 'https://twitter.com/SolaryTV');
        cy
          .get('[data-testid="socials-youtube"]')
          .should('have.attr', 'href', 'https://www.youtube.com/channel/UCb3c6rB0Ru1i9EUcc-a5ZJw');
        cy.get('[data-testid="socials-twitch"]').should('have.attr', 'href', 'https://www.twitch.tv/solary');
        cy.get('[data-testid="socials-snapchat"]').should('have.attr', 'href', 'https://www.snapchat.com/add/solarytv');
        cy.get('[data-testid="socials-instagram"]').should('have.attr', 'href', 'https://www.instagram.com/solarytv/');
        cy.get('[data-testid="socials-facebook"]').should('have.attr', 'href', 'https://www.facebook.com/SolaryTV/');
      });
    });
  });

  describe('Pages', () => {
    describe('Stream', () => {
      it('Should show "SolaryTV" as online', () => {
        cy
          .get('[data-testid="stream-solary"]')
          .should('have.class', 'channel')
          .and('not.have.class', 'offline')
          .and('have.attr', 'href', 'https://twitch.tv/solary')
          .within(() => {
            cy.get('.channel__nickname').should('contain', 'Solary');
            cy.get('.channel__stream-title').should('contain', "SACHAKOR OBJECTIF 3 BADGES AUJOURD'HUI !");
            cy.get('[data-testid="stream-viewers"]').should('contain', '3742');
            cy
              .get('[data-testid="stream-game"]')
              .should('contain', 'Pokémon Red/Blue')
              .should('have.attr', 'href', 'https://www.twitch.tv/directory/game/Pok%C3%A9mon%20Red%2FBlue');
          });
      });

      it('Should show "Solary Fortnite" as offline', () => {
        cy
          .get('[data-testid="stream-solaryfortnite"]')
          .should('have.class', 'channel')
          .and('have.class', 'offline')
          .and('have.attr', 'href', 'https://twitch.tv/solaryfortnite')
          .within(() => {
            cy.get('.channel__nickname').should('contain', 'Solary Fortnite');
            cy.get('.channel__state--offline').should('contain', 'Actuellement hors-ligne');
          });
      });
    });

    describe('Scheduling', () => {
      it('Should show scheduling image', () => {
        cy.get('[data-testid="navigation-scheduling"]').click();
        cy.get('[data-testid="scheduling-url"]').should('have.attr', 'href', 'https://www.solary.fr/programme/');
        cy.get('[data-testid="scheduling-image"]').should('have.attr', 'src');
      });
    });
  });
});
