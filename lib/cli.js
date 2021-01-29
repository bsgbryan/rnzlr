#! /usr/bin/env node

const { isMaster } = require('cluster')

const {
  cpus,
  tmpdir,
} = require('os')

const {
  stat,
  rmdir,
} = require('fs').promises

const {
  log,
  warn,
} = require('./config')()


const   yargs     = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const bootstrap = require('@bsgbryan/madul/bootstrap')

const env = {
  instances: parseInt(process.env.RINZLER_INSTANCES),
}

const params = yargs(hideBin(process.argv)).
  option('instances', {
    alias: 'i',
    type: 'number',
    default: isNaN(env.instances) ? cpus().length : env.instances,
    description: 'Number of clustered instances to run'
  }).
  argv

const main = async () => {
  if (isMaster) {
    let s

    try { s = await stat(`${tmpdir()}/madul`) }
    catch (e) { log('No madul cache to clear') }

    if (s && s.isDirectory()) {
      await rmdir(`${tmpdir()}/madul`, { recursive: true })

      log('Cleared madul cache')
    }
  }

  try { await bootstrap('/Rinzler', params, { root: `${__dirname}/..` }) }
  catch (e) { warn(e.message) }
}

main()
