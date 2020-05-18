// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// module.exports = (on, config) => {
//   // `on` is used to hook into various events Cypress emits
//   // `config` is the resolved Cypress config
// }

const clipboardy = require('clipboardy')

module.exports = (on, config) => {

  on('task', {
    getClipboard() {
      return clipboardy.readSync()
    },
  })

  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--use-fake-ui-for-media-stream')
      args.push('--use-fake-device-for-media-stream')
      args.push('--use-file-for-fake-video-capture=c:\\Users\\Asus\\Documents\\GitHub\\GoodDAPP\\cypress\\fixtures\\face-2.mjpeg')
    }
    return args
  })
}
