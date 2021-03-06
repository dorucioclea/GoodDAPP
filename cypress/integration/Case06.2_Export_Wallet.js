/* eslint-disable no-undef */
import StartPage from '../PageObjects/StartPage'
import LoginPage from '../PageObjects/LoginPage'
import HomePage from '../PageObjects/HomePage'
import ExportWalletPage from '../PageObjects/ExportWalletPage'

describe('Test case 6: Check Export Wallet', () => {
  it('Check Export Wallet page items', () => {
    localStorage.clear()
    StartPage.open()
    StartPage.signInButton.click()
    LoginPage.recoverFromPassPhraseLink.click()
    LoginPage.pageHeader.should('contain', 'Recover')
    cy.readFile('cypress/fixtures/userMnemonicSave.txt').then(mnemonic => {
      LoginPage.mnemonicsInput.type(mnemonic)
      LoginPage.recoverWalletButton.click()
      LoginPage.yayButton.click()
      HomePage.waitForHomePageDisplayed()
    })
    HomePage.optionsButton.click({ force: true })
    HomePage.options.contains('Export Wallet').click()
    ExportWalletPage.titleText.should('be.visible')
    ExportWalletPage.walletKeyTitle.should('be.visible')
    ExportWalletPage.copyKeyButton.should('be.visible')
    ExportWalletPage.copyAddressButton.should('be.visible')
    ExportWalletPage.networkAddressTitle.should('be.visible')
    ExportWalletPage.networkAddressLink.should('be.visible')
    ExportWalletPage.imgAvatar.should('be.visible')
  })
})
