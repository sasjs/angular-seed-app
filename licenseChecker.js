const licenseChecker = require('license-checker')

const check = (cwd) => {
  return new Promise((resolve, reject) => {
    licenseChecker.init(
      {
        production: true,
        start: cwd,
        excludePrivatePackages: true,
        onlyAllow:
          'AFLv2.1;Apache 2.0;Apache-2.0;Apache*;Artistic-2.0;0BSD;BSD*;BSD-2-Clause;BSD-3-Clause;CC0-1.0;CC-BY-3.0;CC-BY-4.0;ISC;MIT;MPL-2.0;ODC-By-1.0;Python-2.0;Unlicense;',
        excludePackages:
          '@cds/city@1.1.0'
      },
      (error, json) => {
        if (error) {
          reject(error)
        } else {
          resolve(json)
        }
      }
    )
  })
}

check(process.cwd(), true)
  .then((res) => console.log('All packages are licensed properly'))
  .catch((err) => console.log('license checker err', err))
