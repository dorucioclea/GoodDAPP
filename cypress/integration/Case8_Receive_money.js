/* eslint-disable no-undef */
import StartPage from '../PageObjects/StartPage'
import LoginPage from '../PageObjects/LoginPage'
import HomePage from '../PageObjects/HomePage'
import ReceiveMoneyPage from '../PageObjects/ReceiveMoneyPage'

describe('Test case 8: Ability to send money request and reseive money', () => {
  it('User is able to send money request', () => {
    StartPage.open()
    StartPage.continueOnWebButton.click()
    StartPage.signInButton.click()
    LoginPage.recoverFromPassPhraseLink.click()
    LoginPage.pageHeader.should('contain', 'Recover')
    LoginPage.mnemonicsInput.type(Cypress.env('additionalAccountMnemonics'))
    LoginPage.recoverWalletButton.click()
    LoginPage.yayButton.click()
    cy.wait(7000)
    HomePage.receiveButton.click()
    ReceiveMoneyPage.pageHeader.should('contain', 'Receive G$')
    ReceiveMoneyPage.requestSpecificAmountButton.should('be.visible')
    ReceiveMoneyPage.shareYourWalletLinkButton.should('be.visible')
    ReceiveMoneyPage.requestSpecificAmountButton.click()
    cy.wait(3000)
    ReceiveMoneyPage.nameInput.should('be.visible')
    ReceiveMoneyPage.nextButton.should('be.visible')
    ReceiveMoneyPage.nameInput.type('Test Account')
    ReceiveMoneyPage.nextButton.click()
    cy.wait(3000)
    ReceiveMoneyPage.moneyInput.should('be.visible')
    ReceiveMoneyPage.nextButton.should('be.visible')
    ReceiveMoneyPage.moneyInput.type('0.01')
    ReceiveMoneyPage.nextButton.click()
    cy.wait(3000)
    ReceiveMoneyPage.messageInput.should('be.visible')
    ReceiveMoneyPage.nextButton.should('be.visible')
    ReceiveMoneyPage.messageInput.type('test lalala')
    ReceiveMoneyPage.nextButton.click()
    cy.wait(3000)
    ReceiveMoneyPage.nextButton.click()
    ReceiveMoneyPage.shareLinkButton.click()
    cy.wait(5000)
    ReceiveMoneyPage.shareLinkButton.invoke('attr', 'data-url').then(reseiveMoneyUrl => {
      var moneyLink = reseiveMoneyUrl
      var pattern = /(?:http[s]?:\/\/)[^\s[",><]*/gim
      var validMoneyLnk = moneyLink.match(pattern)
      cy.log(validMoneyLnk)
      cy.wait(3000)
      ReceiveMoneyPage.doneButton.click()
      HomePage.claimButton.should('be.visible')
      cy.clearLocalStorage()
      cy.clearCookies()
      StartPage.open()
      StartPage.continueOnWebButton.click()
      StartPage.signInButton.click()
      LoginPage.recoverFromPassPhraseLink.click()
      LoginPage.pageHeader.should('contain', 'Recover')
      LoginPage.mnemonicsInput.type(Cypress.env('mainAccountMnemonics'))
      LoginPage.recoverWalletButton.click()
      LoginPage.yayButton.click()
      cy.wait(20000)
      HomePage.claimButton.should('be.visible')
      HomePage.moneyAmountDiv.invoke('text').then(moneyBeforeSending => {
        cy.visit(validMoneyLnk.toString())
        ReceiveMoneyPage.confirmWindowButton.should('be.visible')
        ReceiveMoneyPage.confirmWindowButton.click()
        cy.wait(8000)
        cy.visit(Cypress.env('baseUrl') + '/AppNavigation/Dashboard/Home')
        cy.wait(25000)
        HomePage.claimButton.should('be.visible')
        HomePage.moneyAmountDiv.invoke('text').then(moneyAfterSending => {
          expect(Math.round(10 * (Number(moneyBeforeSending) - 0.01))).to.be.equal(
            Math.round(10 * Number(moneyAfterSending))
          )
        })
      })
    })
  })
})
