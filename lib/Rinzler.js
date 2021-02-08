const {
  log,
  warn,
  iterable,
  bootstrap,
} = require('./config')(sdk)

const listening = w => `worker${w > 1 ? 's' : ''} ready`

const madul = {
  deps: ['cluster[isMaster -> isMain, fork]', '/Handler[boot]', '/Queue[register, assign, clear]'],
  $launch: async ({ isMain, fork, boot, mains, instances, register, assign, clear }) => { 
    if (isMain) {
      const workers = []

      try {
        const params = { instances, workers },
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

        for (let c = 0; c < instances; c++) {
          const f = fork()

          f.on('message', task => {
            if (task.status === 'complete')
              clear({ task, id: f.id })
          })

          workers.push(f)
        }

        register({ workers })

        log(instances, listening(instances))
      }
      catch (e) {
        warn(e.message)

        workers.forEach(w => w.disconnect())
      }

    } else
      await boot()
  }
}
