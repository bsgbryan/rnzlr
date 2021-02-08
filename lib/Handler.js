const { bootstrap } = require('./config')(sdk)

const madul = {
  boot: async () => {
    process.on('message', async msg => {
      const handler = await bootstrap(msg.madul),
            action  = handler[msg.method]

      if (typeof action === 'function') {
        const result = await action(msg.params)

        process.send({
          ...msg,
          result,
          status: 'complete',
        })
      }
    })
  }
}