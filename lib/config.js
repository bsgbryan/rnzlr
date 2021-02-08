const bootstrap = require('@bsgbryan/madul/bootstrap')

module.exports = sdk => {
  let log  = function() { console.log('rinzler.info',     ...arguments) }
  let warn = function() { console.warn('rinzler.warning', ...arguments) }

  if (sdk?.log)
    log = sdk.log

  if (sdk?.warn)
    warn = sdk.warn

  return {
    log,
    warn,
    ...sdk,
    bootstrap,
  }
}
