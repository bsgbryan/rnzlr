#! /usr/bin/env node

const { isPrimary } = require('cluster')

const {
  cpus,
  tmpdir,
} = require('os')

const {
  rm,
  stat,
} = require('fs').promises

const {
  log,
  warn,
} = require('./config')()


const   yargs     = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const {
  iterable,
  bootstrap,
 } = require('@bsgbryan/madul')

const env = {
  instances: parseInt(process.env.RINZLER_INSTANCES),
}

const params = yargs(hideBin(process.argv)).
  command('<mains..>', 'start rinzler').
  option('instances', {
    alias: 'i',
    type: 'number',
    default: isNaN(env.instances) ? cpus().length : env.instances,
    description: 'Number of clustered instances to run'
  }).
  help().
  argv

params.mains = params._
  
const main = async () => {
  if (isPrimary) {
    if (params.mains.length > 0) {
      let s

      try { s = await stat(`${process.cwd()}/.maduls`) }
      catch (e) { log('No madul cache to clear') }

      if (s && s.isDirectory()) {
        await rm(`${process.cwd()}/.maduls`, { recursive: true })

        log('Cleared madul cache')
      }
    }
    else {
      log('<mains> is required')

      process.exit(0)
    }
  }

  const config = {
    sdk: {
      iterable,
      fs: require('fs').promises,
    },
    root: `${__dirname}/..`,
  }

  try { await bootstrap('/Rinzler', params, config) }
  catch (e) { warn(e.message) }
}

main()
