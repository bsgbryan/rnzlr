const {
  log,
  warn,
  iterable,
  bootstrap,
} = require('./config')(sdk)

const listening = w => `worker${w > 1 ? 's' : ''} ready`

const madul = {
  deps: ['cluster[isPrimary, fork]', '/Handler[boot]', '/Queue[register, assign, clear]'],
  $launch: async ({ isPrimary, fork, boot, mains, instances, register, assign, ...rest }) => { 
    if (isPrimary) {
      const workers = []

      try {
        for (let c = 0; c < instances; c++)
          workers.push(fork())

        register({ workers })

        log(instances, listening(instances))

        const params = { instances, workers, ...rest },
              config = {
                sdk: {
                  assign,
                  ...sdk,
                },
                root: process.cwd(),
              }

        await iterable(mains).each(
          async m => await bootstrap(m, params, config)
        )
      }
      catch (e) {
        warn(e.message)

        workers.forEach(w => w.disconnect())
      }

    } else
      await boot()
  }
}
