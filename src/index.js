const createConfig = require('./utils/create-config')
const generateAndSave = require('./utils/generate')
const verify = require('./utils/verify')
const TEMP_DIR_NAME = 'tmp'

const hydrate = {
  async copy ({ arc, copy, inventory }) {
    const params = { arc, inventory }

    if (verify(params)) {
      const config = createConfig(params)
      await generateAndSave(config)

      console.log('  Enhance Styles: CSS generated.')

      await copy({
        source: TEMP_DIR_NAME, // relative to the project root
        target: '@architect/shared/enhance-styles',
      })
    }
  },
}

const sandbox = {
  async watcher (params) {
    if (verify(params)) {
      const { filename } = params
      const config = createConfig(params)

      if (config.configPath && config.configPath === filename) {
        console.log('  Enhance Styles: config changed, rebuilding.')
        await generateAndSave(config)
      }
    }
  },
}

const set = {
  http () {
    return [
      {
        method: 'get',
        path: '/enhance-styles.css',
        src: `${__dirname}/handlers/css`,
        config: { views: false },
      },
      {
        method: 'get',
        path: '/_styleguide',
        src: `${__dirname}/handlers/guide`,
        config: { views: false },
      },
    ]
  },
}

module.exports = { hydrate, sandbox, set }
